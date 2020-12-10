import { elements} from './base';

export const getInput = () =>{
    return elements.searchInput.value; 
} // Takes the string in search field.

export const clearInput = () =>{
    elements.searchInput.value = '';
};

export const clearList = () =>{
    elements.searchedResList.innerHTML = ''
    elements.addResPages.innerHTML = ''
};

export const highlightSelected = id =>{
    const resultArr = Array.from(document.querySelectorAll('.results__link'))
    resultArr.forEach(el => el.classList.remove('results__link--active'))

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};





/*Pasta with Tomato and spinach
acc:0 / acc + curr(length of "pasta"):     +5  = 5 / newTitle = ['pasta'] 
acc:5 / acc + curr(length of "with"):      +4  = 9 / newTitle = ['pasta']
acc:9 / acc + curr(length of "tomato"):    +6  = 15 / newTitle = ['pasta'] 
acc:15 / acc + curr(length of "and"):      +3  = 18 / newTitle = ['pasta'] > limit so acc is 15
acc:15 / acc + curr(length of "spinach"):  +7  = 22 / newTitle = ['pasta'] > limit

*/


const limitRecipeTitle = (title, limit = 14) => {
    const newTitle = [];
    if (title.length > limit){
        title.split(' ').reduce((acc, cur) =>{
            if(acc <= limit){
                newTitle.push(cur);
                return acc + cur.length
            }
           
        }, 0);
        return `${newTitle.join(' ')} ...`; // join array element bu adding space betn them i.e. opposite of split

    }
    return title;
};

const renderRecipe = recipe =>{   
    const resultHtml = `
    <li>
        <a class="results__link " href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchedResList.insertAdjacentHTML('beforeend', resultHtml)
};
// type is either previous or next for goto btns
const createBtn = (page, type) =>`
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
    </button>
`;

const renderBtn = (page, totalLength, resPerPage) => {
    let button;
    const pages = Math.ceil(totalLength / resPerPage );
    if (page === 1 && pages > 1){
        //Render btn to next page only as it is first page
        button = createBtn(page, 'next');

    } else if(page < pages ){
        //Render both previous and next btn
        button = `
            ${button = createBtn(page, 'prev')}
            ${button = createBtn(page, 'next')}
        `;

    } else if (page === pages && pages > 1 ){
        //Render previous page only as it is last page
        button = createBtn(page, 'prev');

    }
    elements.addResPages.insertAdjacentHTML('afterbegin', button);
};


export const renderResults = (recipes, page = 1, resPerPage = 10) =>{
    // Configuration for rendering recipies pre pages
    const start = (page - 1)* resPerPage;
    const end = page * resPerPage;

    //rendering portion of recipies in each page
    recipes.slice(start, end).forEach(renderRecipe); // is same as recipes.forEach(el => renderRecipe(el)); where elements(el) is automatically passed

    // Adding pages button
    renderBtn(page, recipes.length, resPerPage)
};