import Axios from "axios";

import axios from "axios";
export default class {
    constructor(id){
        this.id = id;
    }

/**
result ={
image_url: "http://forkify-api.herokuapp.com/images/best_pizza_dough_recipe1b20.jpg"
ingredients: (6) ["4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled", "1 3/4 (.44 ounce) teaspoons salt", "1 teaspoon (.11 ounce) instant yeast", "1/4 cup (2 ounces) olive oil (optional)", "1 3/4 cups (14 ounces) water, ice cold (40F)", "Semolina flour OR cornmeal for dusting"]
publisher: "101 Cookbooks"
publisher_url: "http://www.101cookbooks.com"
recipe_id: "47746"
social_rank: 100
source_url: "http://www.101cookbooks.com/archives/001199.html"
title: "Best Pizza Dough Ever"
}
 */

    async getRecipe() {
        try{
            const temp = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.result = temp.data.recipe
        }
        catch(error){
            alart(error);
        }

    }

    calcTime(){
        const numIng = this.result.ingredients.length;
        this.time = Math.ceil(numIng/3) * 15; // considering take 15 min pre 3 ingredients to cook
        
    }

    calcServings(){
        this.servings = 1;
    }


    updateServings(type){
        //serving
        const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;


        //ingredients
        this.result.ingredients.forEach(el =>{
            el.count *= newServing/this.servings
        });

        this.servings = newServing;
    }

    parserIngredients(){

        const unitsLong = ['tablespoons','tablespoon', 'ounces', 'ounce','teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz','oz', 'tsp', 'tsp','cup','pound'];
        

        /* 
        ingredients: ["7 1/2 cups all-purpose flour (1000 grams) plus more for shaping dough", "4 teaspoons fine sea salt", "1/2 teaspoon active dry yeast"]
        
        ingredient = el.toLowerCase  => 7 1/2 cups all-purpose flour (1000 grams) plus more for shaping dough 
           
        unitsLong.forEach((unit, i)=>{
            ingredient = ingredient.replace(unit, unitsShort[i])  ==> replaces 'cups' to 'cup'
            then ingredints become
            ingredient = 7 1/2 cup all-purpose flour (1000 grams) plus more for shaping dough
        });


        */


        const newIngeridents = this.result.ingredients.map(el =>{ 
            //1) Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i)=>{
              ingredient = ingredient.replace(unit, unitsShort[i])
            });

            //2) Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3) parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ')
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2)); // return True if the unit exist by checking unitsShorts
            
            
            let objIng= {};

            if (unitIndex > -1){
                // this means there exist a unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng= {
                    count: count.toFixed(1),
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)){
                // No units but there exits a number
                objIng = {
                    count : parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            }else if (unitIndex === -1){
                //there is no unit and no number in first position
                objIng = {
                    count : 1,
                    unit: '',
                    ingredient 
                }


            }

            return objIng;
        });
        this.result.ingredients = newIngeridents
    }



}





