export default class {
    constructor(){
        this.likes = []
    }


    addLikes(id, title, publisher, img){
        const like = {id, title, publisher, img}
        this.likes.push(like)
        return like;

    }

    deleteLikes(id){
        const index = this.likes.findIndex(el => el.id === id)
        this.likes.splice(index, 1);
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;  //return -1 if the index is not found
    }

    getNumLikes(){
        return this.likes.length;
    }
}