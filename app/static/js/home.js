function addInput() {
    let newInput = document.createElement('input');
    let newDiv = document.createElement('div');
    let newHeader = document.createElement('label');
    let inputArray = form.getElementsByClassName('artist-input');
    let lastIndex = inputArray.length - 1;
    let lastInput = inputArray[lastIndex];
    let latestIdNum = Number(lastInput.id.split('-')[1]);
    newInput.type = 'text';
    newInput.id = `artist-${latestIdNum + 1}`;
    newInput.name = `artist-${latestIdNum + 1}`;
    newInput.classList.add('artist-input');
    newInput.required = true;
    newInput.setAttribute('autocomplete', 'off');
    newDiv.id = `artist-div-${latestIdNum + 1}`;
    newDiv.classList.add('input-div');
    newHeader.textContent = `Artist ${latestIdNum + 1}`;
    newHeader.setAttribute('for', `artist-${latestIdNum + 1}`);

    let newBtn = document.createElement('button');
    newBtn.type = 'button';
    if (latestIdNum === 9) {
        let br = document.createElement('br');
        let div = form.appendChild(newDiv);
        div.appendChild(newHeader);
        div.appendChild(newInput);
    } else {
        newBtn.textContent = '+';
        newBtn.classList.add('btn-add-input');
        newBtn.addEventListener('click', changeAttrCreate);
        let div = form.appendChild(newDiv);
        div.appendChild(newHeader);
        div.appendChild(newInput);
        div.appendChild(newBtn);
    }
    let subBtn = form.getElementsByClassName('submit-btn')[0];
    let copyBtn = subBtn.cloneNode(true);
    subBtn.remove();
    form.appendChild(copyBtn);
}

function removeInput() {
    const deletedIndex = Number(this.previousSibling.id.split('-')[1]);
    let remainingInput = form.getElementsByClassName('artist-input');
    $(this).parent()[0].remove();
    for (let i = 0; i < remainingInput.length; i++) {
        let prevIndex = Number(remainingInput[i].id.split('-')[1]);
        if (prevIndex < deletedIndex) {
            continue;
        } else if (prevIndex > deletedIndex) {
            remainingInput[i].id = `artist-${prevIndex - 1}`;
            remainingInput[i].setAttribute('name', `artist-${prevIndex - 1}`);
            remainingInput[i].parentElement.setAttribute('id', `artist-div-${prevIndex - 1}`);
            remainingInput[i].parentElement.getElementsByTagName('label')[0].textContent = `Artist ${prevIndex - 1}`;
            remainingInput[i].parentElement.getElementsByTagName('label')[0].setAttribute('for', `artist-${prevIndex - 1}`);
        }
    }
    this.remove();
}

function changeAttrCreate() {
    let btn = document.getElementsByClassName('btn-add-input')[0];
    btn.textContent = '-';
    btn.setAttribute('class', 'btn-remove-input');
    addInput();
    btn.removeEventListener('click', changeAttrCreate);
    let buttonsRemove = document.getElementsByClassName('btn-remove-input');
    for (let i = 0; i < buttonsRemove.length; i++) {
        buttonsRemove[i].addEventListener('click', removeInput);
    }
}

let buttonAdd = document.getElementsByClassName('btn-add-input')[0];

let form = document.querySelector('.form');
buttonAdd.addEventListener('click', changeAttrCreate);

function findResults(elem, resultsList) {
    // Gets results from server and appends results to search results
    let search = $(elem).val();
    let currentDiv = $($(elem).parent())[0]
    let resultsDiv = $(currentDiv).find('.search-results');
    if (search != '') {
        $.getJSON($SCRIPT_ROOT + '/ajax/search_artist', {
           artist: search,
        }, function(data) {
            data = data['artists'];
            let len = data.length;
            $(resultsList).empty();
            if (data.length !== 0) {
                for (let i = 0; i < len; i++) {
                    let name = data[i]['name'];
                    resultsList.append(`<li class="result artist">` + name + '</li>');
                }
            } else {
                $(resultsList).append('<li class="empty result"> No Results Found </li>');
            }
        });
    }
}

function main() {
    let currentBox;
    let resultsList;
    $(document).on('input', '.artist-input', function(e) {
        // Creates a results menu under search box and finds results from spotify
        currentBox = e.target;
        let divElem = $($(currentBox).next()[0]).next();
        if (divElem[0]) {
            let div = $(divElem[0]);
            resultsList = $(div[0]).find('.results-list');
        } else {
            divElem = $($(currentBox).next()[0]).after('<div class="search-results" style="position: relative;"></div>');
            let resultsDiv = $(divElem.next())[0];
            $(resultsDiv).append('<ul class="results-list" style="position: absolute;"></ul>');
            resultsList = $(resultsDiv).find('.results-list');
        }
        findResults(currentBox, resultsList);
    });
    $(document).on('click', 'li.result', function () {
        // Autofilling Input to selected artist from menu
        let text = this.textContent;
        console.log('asd11');
        if (this.classList.contains('empty') !== true) {
            // If there are any results, autofill; else, do nothing
            let inputDiv = this.parentElement.parentElement.parentElement;
            let inputBox = inputDiv.getElementsByClassName('artist-input');
            inputBox[0].value = text;
            console.log('asdf');
        }
    });
    $(document).on('click focus focusout', '.artist-input', function(e) {
        let input = $(this);
        let parentDiv = input.parent();
        let searchResults = parentDiv.find('.search-results');
        showResults = function () {
            hideResults();
            showing = parentDiv;
            searchResults.show();
            searchResults = parentDiv.find('.search-results');
        };
        hideResults = function () {
            searchResults.hide();
            searchResults = parentDiv.find('.search-results');
        };
        if (e.type == 'focusout') {
            // hideResults();
        } else {
            showResults();
        }
    });
    $(document).on('click', function(e) {
        if(showing) {
            let parent = showing[0];
            console.log(parent);
            console.log(e.target)
            if (e.target.classList.contains('result')) {
                showResults();
                hideResults();
                console.log('hidden');
            }
            if (!$.contains(parent, e.target) || !parent == e.target) {
                hideResults();
            }
        }
    });
}

let showResults;
let hideResults;
let showing;
let prevTarget = null;

$(document).ready(main)
