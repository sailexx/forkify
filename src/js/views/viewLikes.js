import { elements } from "./base";

export const toggleLikeBtn = isLiked =>{
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
};

export const toggleLikesMenu = numLikes =>{
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' :'hidden';

};



export const renderLikes = (like) =>{
    const likeHtml = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="Test">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${like.title}</h4>
                <p class="likes__author">${like.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.likeList.insertAdjacentHTML('beforebegin', likeHtml);  
}

export const deleteLike = id => {
    const el = document.querySelector(`.likes_link[href="#${id}"]`).parentElement;
    el.parentElement.removeChild(el);

}