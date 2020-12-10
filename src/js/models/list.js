import uniqid from "uniqid";

export default class {
    constructor(){
        this.item = [];
    }


    addItem(count, unit, ingredients){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredients
        }
        this.item.push(item);
        return item
    }

    deleteItem(id){
        const index = this.item.findIndex(el => el.id === id );
        this.item.splice(index, 1);    
    }

    updateCount(id, newCount){
        this.item.find(el => el.id === id).count = newCount; //finds element of array if the coudition is true
    }


}