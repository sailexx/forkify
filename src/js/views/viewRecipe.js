import { elements } from "./base";
import { Fraction } from "fractional";

const format = (count) =>{
    // count = 2.5 = 2 1/5
    // count = 0.5 = 1/5
    if(count){
       const [int, dec] = count.toString().split('.').map(el => parseInt(el, 10))
       if(!dec){
           return count
       }
       if(int === 0){
           const temp = new Fraction(count)
           return `${temp.numerator}/${temp.denominator}`;
       }else{
           const temp = new Fraction(count - int)
           return `${int} ${temp.numerator}/${temp.denominator}`;

       }
    } 
    return '?';
};



const createIng = (ing) =>
    `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${format(ing.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.ingredient}
        </div>
    </li>
`;
export const clearRecipe = () =>{
    elements.recipe.innerHTML = '';
};


export const renderRecipe = (recipe, time = 90, serving = 4, isLiked) =>{
    const recipeHTML = `
            <figure class="recipe__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${serving}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map(el => createIng(el)).join('')}
                </ul>

                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">T${recipe.publisher}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.source_url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', recipeHTML)
};
 
export const updateServingsIngredients = recipe =>{
    //Update Serving
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    // updae ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) =>{
        el.textContent = format(recipe.result.ingredients[i].count);
    });
};