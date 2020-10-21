function addInput(btn) {
    let newInput = document.createElement('input');
    let newDiv = document.createElement('div');
    let newHeader = document.createElement('label');
    let form = btn.parentElement.parentElement;
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
    newHeader.textContent = `${latestIdNum + 1}.`;
    newHeader.setAttribute('for', `artist-${latestIdNum + 1}`);
    newHeader.classList.add('artist-label');
    let newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.textContent = '+';
    newBtn.classList.add('btn-add-input');
    newBtn.classList.add('btn');
    newBtn.classList.add('form-btn');
    newBtn.addEventListener('click', changeAttrCreate);
    if (latestIdNum === 9) {
        let br = document.createElement('br');
        let div = form.appendChild(newDiv);
        newBtn.style.visibility = 'hidden';
        newInput.classList.add('artist-last');
        div.appendChild(newHeader);
        div.appendChild(newInput);
        div.appendChild(newBtn);
    } else {
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
            remainingInput[i].parentElement.getElementsByTagName('label')[0].textContent = `${prevIndex - 1}.`;
            remainingInput[i].parentElement.getElementsByTagName('label')[0].setAttribute('for', `artist-${prevIndex - 1}`);
            let button = remainingInput[i].parentElement.getElementsByClassName('btn-add-input')[0];
            if (button) {
                button.style.visibility = 'visible';
            }
         }
    }
    this.remove();
}

function changeAttrCreate() {
    let btn = document.getElementsByClassName('btn-add-input')[0];
    btn.textContent = '-';
    btn.setAttribute('class', 'btn-remove-input');
    btn.classList.add('btn');
    btn.classList.add('form-btn');
    addInput(btn);
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

function showResults({prevTarget, elem} = {}) {
    if (elem) {
        let results = $(elem).siblings('.search-results').first();
        if (results) {
            $(results).show();
        }
    }
}

function hideResults({prevTarget, elem} = {}) {
    // Hide results
    let results;
    if (prevTarget) {
        results = $(prevTarget).siblings('.search-results').first();
        if (results) {
            $(results).hide();
            results = null;
        }
    }
    if (elem) {
        results = $(elem).siblings('.search-results').first();
        if (results) {
            $(results).hide();
            results = null;
        }
    }
}

function autofillResult(elem) {
    // Autofill Result
    elem = elem[0];
    let text = elem.textContent;
    if (elem.classList.contains('empty') !== true) {
        // If there are any results, autofill; else, do nothing
        let inputDiv = elem.parentElement.parentElement.parentElement;
        let inputBox = inputDiv.getElementsByClassName('artist-input');
        inputBox[0].value = text;
        hideResults({elem: inputBox});
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
    let prevTarget;
    $(document).on('click focus keyup', function(e) {
        let target = $(e.target);
        let searchResults = $(target).siblings('.search-results');
        // Tab out
        if (e.type == 'keyup') {
            if (e.which == 9) {
                if ($(target).hasClass('artist-input')) {
                    showResults({elem: target});
                } else {
                    hideResults({prevTarget: prevTarget});
                }
            }
        }
        // Clicking on input box
        if ($(target).hasClass('artist-input')) {
            // Checking if coming from other input box
            if ($(prevTarget).hasClass('artist-input')) {
                hideResults({prevTarget: prevTarget});
            }
            // Always show results
            showResults({elem: target});
        }
        // Checking if clicking on result
        if ($(target).hasClass('result')) {
            autofillResult(target);
        }
        // Checking if clicking on irrelevant elements
        if ($(target).hasClass('artist-input') !== true && $(target).hasClass('result') !== true) {
            hideResults({prevTarget: prevTarget});
        }
        prevTarget = target;
    });
}

let showing;
let prevTarget = null;

// let stylesheet = document.getElementsByTagName('link')[0];
// let href = stylesheet.getAttribute('href');
// href = `${href}?v=${Math.floor(Math.random()*100)}`;
// stylesheet.setAttribute('href', href);

$(document).ready(main)
