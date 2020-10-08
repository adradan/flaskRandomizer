function ifChecked() {
    if (this.checked) {
        this.nextSibling.nextSibling.style.visibility = 'hidden';
    } else {
        this.nextSibling.nextSibling.style.visibility = 'visible';
    }
}

function validateForms() {
    let matchBoxes = document.getElementsByClassName('match-check');
    let correctNames = document.getElementsByClassName('correct-div')[0];
    for (let i = 0; i < matchBoxes.length; i++) {
        let checkBox = matchBoxes[i]
        if (checkBox.checked !== true) {
            let params = new URLSearchParams(location.search)
            params.get(`artist`)
        }
    }
}

let noMatches = document.getElementsByClassName('match-check');
for (let i = 0; i < noMatches.length; i++) {
    noMatches[i].addEventListener('click', ifChecked);
}

document.getElementById('create-button').addEventListener('click', validateForms);