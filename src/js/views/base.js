export const elements = {
    searchBtn: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchedResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    addResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    likesMenu: document.querySelector('.likes__field'),
    shopping: document.querySelector('.shopping__list'),
    likeList:document.querySelector('.likes__list')
}
export const elementString = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
        <div class ="${elementString.loader}">
            <svg>
            <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementString.loader}`);
    if(loader){
        loader.parentElement.removeChild(loader); 
    }
};