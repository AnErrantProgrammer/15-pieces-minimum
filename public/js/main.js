const App = new Vue({
    el: '#app',
    data: {
        userId: '',
        pin: '',
        showPIN: true,
        leftBar: document.getElementById('left-bar'),
        rightBar: document.getElementById('right-bar'),
        message: 'Hello World',
        pickedFlair: [],
        unPickedFlair: [],
        draggedFlair: -1
    },
    mounted: function() {
        var _this = this;
        for (var i = 0; i < 250; i++) {
            this.unPickedFlair.push({
                id: Math.floor(Math.random() * 2399) + 1,
                left: this.generateSafeLeft(),
                top: ((Math.floor(Math.random() * document.body.clientHeight)) / document.body.clientHeight) * 100,
                size: ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)]
            })
        }

        this.userId = document.location.pathname.replace('/', '');
        this.leftBar = document.getElementById('left-bar');
        this.rightBar = document.getElementById('right-bar');

        axios.get(`flair/${this.userId}`)
            .then(function(response) {

                response.data.pickedFlair.forEach((e) => {
                    _this.pickedFlair.push(e);
                });
            })
            .catch(function(error) {
                console.log(error);
            });

        this.$forceUpdate();
    },
    methods: {
        saveFlair: function() {
            axios.patch(`flair/${this.userId}`, {
                    pickedFlair: JSON.parse(JSON.stringify(this.pickedFlair))
                })
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });

        },
        generateSafeLeft: function() {
            var offset = Math.floor(Math.random() * (document.body.clientWidth * 0.24));
            var side = [0, (document.body.clientWidth * 0.76 - 64)][Math.floor(Math.random() * 2)];
            return ((side + offset) / document.body.clientWidth) * 100;
        },
        myDrag: function(key, event) {
            event.preventDefault();
            this.draggedFlair = key;
            var size = event.target.getBoundingClientRect();
            this.draggedFlair.left = ((event.clientX - (size.width / 2)) / document.body.clientWidth) * 100; // 
            this.draggedFlair.top = ((event.clientY - (size.height / 2)) / document.body.clientHeight) * 100; //
            this.moveAt(event);
        },
        moveAt: function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.draggedFlair !== -1) {
                if (event.target.parentElement.classList.value.indexOf('flair') == -1) {
                    this.draggedFlair = -1;
                    return false;
                }
                var size = event.target.getBoundingClientRect();

                this.draggedFlair.left = ((event.clientX - (size.width / 2)) / document.body.clientWidth) * 100; // 
                this.draggedFlair.top = ((event.clientY - (size.height / 2)) / document.body.clientHeight) * 100; //

                if (event.target.parentElement.parentElement.classList.value != 'picked-flair') {
                    if (this.isCollide(event.target, this.leftBar) || this.isCollide(event.target, this.rightBar)) {
                        var selected = this.unPickedFlair.splice(this.unPickedFlair.indexOf(this.draggedFlair), 1);
                        this.pickedFlair.push(selected[0]);
                        this.draggedFlair = this.pickedFlair[this.pickedFlair.length - 1];
                    }
                } else if (event.target.parentElement.parentElement.classList.value != 'picked-flair') {
                    if (!this.isCollide(event.target, this.leftBar) && !this.isCollide(event.target, this.rightBar)) {
                        var selected = this.pickedFlair.splice(this.pickedFlair.indexOf(this.draggedFlair), 1);
                        this.unPickedFlair.push(selected[0]);
                        this.draggedFlair = this.unPickedFlair[this.unPickedFlair.length - 1];
                    }
                }
            }
        },
        myDragStop: function(event) {
            this.draggedFlair = -1;
            this.saveFlair();
        },

        isCollide: function(a, b) {
            var aRect = a.getBoundingClientRect();
            var bRect = b.getBoundingClientRect();

            return !(
                ((aRect.top + aRect.height) < (bRect.top)) ||
                (aRect.top > (bRect.top + bRect.height)) ||
                ((aRect.left + aRect.width) < bRect.left) ||
                (aRect.left > (bRect.left + bRect.width))
            );
        }
    }
});