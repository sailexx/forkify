import Search from './models/Search';
import Recipe from './models/recipe';
import List from './models/list';
import Like from './models/likes';
import * as viewSearch from './views/viewSearch'
import * as viewRecipe from './views/viewRecipe'
import * as viewList from './views/viewList'
import * as viewLikes from './views/viewLikes'
import { elements, renderLoader, clearLoader  } from './views/base';


// Global app controller

/*
Global state of app
Search oject
current recipe object
shopping list
like recipes
*/

const state = {};
window.state = state;

const controlSearch = async ()=>{
    // Get the Search queries
    const query = viewSearch.getInput();
    

    //
    if(query){
        // add new search object in state model
        state.Search = new Search(query);


        // Prepare the UI for result like adding spinner
        viewSearch.clearInput();                             // clear inputs in search fields i.e query
        viewSearch.clearList();                              //clear the result for next search
        renderLoader(elements.searchRes);
        try{
            // search for recipes
            await state.Search.getResult();

            //Update/Render the search result
            clearLoader(); 
            viewSearch.renderResults(state.Search.result);

        }catch(error){
            alert('Error for search of recipe')
        }

        
    }

}

elements.searchBtn.addEventListener('submit', e => {
    e.preventDefault(); // prevent page from reloading
    controlSearch();
});



elements.addResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); //closest mdn
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10) //10 is to denote it is 10 based number 10
        viewSearch.clearList();
        viewSearch.renderResults(state.Search.result, goToPage);
         

    }
});
// RECIPE CONROLLER

const controlRecipe = async () =>{
    //
    const id = window.location.hash.replace('#', '');

    if(id){
        // prepare the UI
        viewRecipe.clearRecipe();
        renderLoader(elements.recipe);
        // Highlighting selected recipe
        if(state.Search){
            viewSearch.highlightSelected(id)
        }

        //creae recipe object
        state.Recipe = new Recipe(id);
        

        //try{
            //get the recipes
            await state.Recipe.getRecipe();
            //console.log(state.Recipe.result.ingredients);
            state.Recipe.parserIngredients()
            

            // calc time and serving => TODO
            state.Recipe.calcTime();
            state.Recipe.calcServings();

            //render the recipe in UI
            clearLoader();
            viewRecipe.renderRecipe(state.Recipe.result, 
                state.Recipe.time, 
                state.Recipe.servings, 
                state.Like.isLiked(id));

       //}catch(error){
           // alert('Error in request for recipe')
        //}

    }

}


// window.addEventListener('load', controlRecipe);
// window.addEventListener('hashchange', controlRecipe);
//    | |
//   \| |/
//    \ /
//   same as

['load', 'hashchange'].forEach(event => window.addEventListener(event, controlRecipe));


//List Controller

const controlList = () => {
    // create a new list if there is not yet
    if(!state.List) state.List = new List();

    // Add each ingrediens to the list and UI
    state.Recipe.result.ingredients.forEach(el => {
        //console.log(el)
        const item = state.List.addItem(el.count, el.unit, el.ingredient)
        viewList.renderItem(item);
    })
    //console.log(state.Recipe.result.ingredients)
};

// handel delect item and update UI
elements.shopping.addEventListener('click', e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // Delete from state
        state.List.deleteItem(id);
        // delete from UI
        viewList.deleteItem(id);

    }else if (e.target.matches('.shopping__count--value')){
        const val = parseFloat(e.target.value, 10)
        if(val >= 0)state.List.updateCount(id , val);
    }


});
//Testing
state.Like = new Like();

// LIKE CONTROLLER
const controlLike = () =>{
    // create like onj if it is not there
    if(!state.Like) state.Like = new Like();
    const curID = state.Recipe.id;

    //user has not liked current recipe
    if(!state.Like.isLiked(curID)){
        // add like to state
        const newLike = state.Like.addLikes(
            curID,
            state.Recipe.result.title, 
            state.Recipe.result.publisher, 
            state.Recipe.result.image_url, 
        )
        // toggle the like button
        viewLikes.toggleLikeBtn(true);


        //add like to UI List
        console.log(state.Like)
        viewLikes.renderLikes(newLike)



    }else{
        // remove like from state
        state.Like.deleteLikes(curID); 

        // toggle the like button
        viewLikes.toggleLikeBtn(false);

        //remove like from UI List
        viewLikes.deleteLike(curID)
    }
    viewLikes.toggleLikesMenu(state.Like.getNumLikes());

};



// Updating Servings
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){// returns true if btn-decrease matches with btn-decrease or its childs
        // decrease Servings is clicked
        if(state.Recipe.servings > 1){
            state.Recipe.updateServings('dec');
            viewRecipe.updateServingsIngredients(state.Recipe);
            console.log(state.Recipe)
        }
        
    }else if(e.target.matches('.btn-increase, .btn-increase *')){// returns true if btn-increase matches with btn-increase or its childs
        // Increase Servings is clicked
        state.Recipe.updateServings('inc');
        viewRecipe.updateServingsIngredients(state.Recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();

    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        // Like Conroller
        controlLike();
    }

});