var app = new Vue({
    el: '#admin',
    data: {
        title: "",
        file: null,
        description: "",
        ingredient: "",
        ingredients: [
          {description: ''}
        ],
        ingredientsToPost: [],
        step: "",
        steps: [
          {description: ''}
        ],
        stepsToAdd: [],
        addItem: null,
        items: [],
        findTitle: "",
        findDescription: "",
        findItem: null,
    },
    created() {
        this.getItems();
    },
    computed: {
        suggestions() {
            return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
        },
    },
    watch: {

    },
    methods: {
        async getItems() {
            try {
                let response = await axios.get("/api/items");
                this.items = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        fileChanged(event) {
            this.file = event.target.files[0]
        },
        async upload() {
          var i;
          for (i = 0; i < this.ingredients.length; ++i)
          {
            console.log(this.ingredients[i].description);
            this.ingredientsToPost.push(this.ingredients[i].description);
          }
          for (i = 0; i < this.steps.length; ++i)
          {
            console.log(this.steps[i].description);
            this.stepsToAdd.push(this.steps[i].description);
          }
            try {
                const formData = new FormData();
                formData.append('photo', this.file, this.file.name)
                let r1 = await axios.post('/api/photos', formData);
                let r2 = await axios.post('/api/items', {
                    title: this.title,
                    description: this.description,
                    path: r1.data.path,
                    ingredients: this.ingredientsToPost,
                    steps: this.stepsToAdd
                });
                this.addItem = r2.data;
            } catch (error) {
                console.log(error);
            }
        },
        selectItem(item) {
            this.findTitle = "";
            this.findItem = item;
        },
        async deleteItem(item) {
            try {
                let response = await axios.delete("/api/items/" + item._id);
                this.findItem = null;
                this.getItems();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        async editItem(item) {
            try {
                let response = await axios.put("/api/items/" + item._id, {
                    title: this.findItem.title,
                    description: this.findItem.description,
	            ingredients: this.findItem.ingredients,
		    steps: this.findItem.steps,
                });
                this.findItem = null;
                this.getItems();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        addStep() {
            this.steps.push(this.step);
            this.step = "";
        },
        addIngredient() {
            this.ingredients.push({description: this.ingredient});
            this.ingredient = "";
        },
        /*addFindStep() {
            this.steps.push(this.step);
            this.step = "";
        },
        addFindIngredient() {
            this.ingredients.push(this.ingredient);
            this.ingredient = "";
        },
	removeFindIngredient() {
      	    this.findItem.ingredients.pop();
	},
	removeFindStep() {
	    this.findItem.steps.pop();
	},*/

    }
});
