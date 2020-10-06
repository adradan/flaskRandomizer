function ifChecked() {
    if (this.checked) {
        this.nextSibling.style.visibility = 'hidden';
    } else {
        this.nextSibling.style.visibility = 'visible';
    }
}

let noMatches = document.getElementsByClassName('match-check');
for (let i = 0; i < noMatches.length; i++) {
    noMatches[i].addEventListener('click', ifChecked);
}