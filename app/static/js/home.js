function addInput() {
    let newInput = document.createElement('input');
    let newDiv = document.createElement('div');
    let inputArray = form.getElementsByClassName('artist-input');
    let lastIndex = inputArray.length - 1;
    let lastInput = inputArray[lastIndex];
    let latestIdNum = Number(lastInput.id.split('-')[1]);
    // let lineBreak = document.createElement('br');
    // form.appendChild(lineBreak);
    newInput.type = 'text';
    newInput.id = `artist-${latestIdNum + 1}`;
    newInput.name = `artist-${latestIdNum + 1}`;
    newInput.classList.add('artist-input');
    newInput.required = true;
    newDiv.id = `artist-div-${latestIdNum + 1}`;
    newDiv.classList.add('input-div');

    let newBtn = document.createElement('button');
    newBtn.type = 'button';
    if (latestIdNum === 9) {
        let br = document.createElement('br');
        let div = form.appendChild(newDiv);
        div.appendChild(newInput);
        // div.appendChild(br);
    } else {
        newBtn.textContent = '+';
        newBtn.classList.add('btn-add-input');
        newBtn.addEventListener('click', changeAttrCreate);
        let div = form.appendChild(newDiv);
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
            remainingInput[i].setAttribute('name', `artist-${prevIndex = 1}`);
            remainingInput[i].parentElement.setAttribute('id', `artist-div-${prevIndex - 1}`);
        } else {
            continue;
        }

    }
    // if (deletedIndex === 1) {
    //     let brs = form.querySelectorAll('br');
    //     brs[0].remove();
    // }
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
                    // let style = 'style="position: absolute; top: 0; left: 0;"';
                    let name = data[i]['name'];
                    // if (i === 0) {
                    //     console.log(i);
                    //     style = 'style="position: absolute;"'
                    // }
                    resultsList.append(`<li class="result artist">` + name + '</li>');
                }
            } else {
                $(resultsList).append('<li class="empty result"> No Results Found </li>');
            }
        });
    }
}

function checkClick() {
    $('input').attr('autocomplete', 'off');
    let currentBox;
    let resultsList;
    $(document).on('input', '.artist-input', function(e) {
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
    $(document).click(function(e) {
        let elem = e.target;
        console.log(elem);
        let searchResults;
        console.log(prevTarget);
        console.log(elem);
        // FIX SEARCH RESULTS APPEARING/HIDING
        if ($(elem).attr('class') === 'artist-input' && elem.id != prevTarget.id) {
            console.log('haha');
            prevTarget = elem;
            searchResults = $($(elem).parent()).find('.search-results');
            let parent = $(prevTarget).parent();
            parent = $(parent).find('.search-results');
            $(parent).hide();
            // $($($(prevTarget).parent()).find('.search-results')).hide();
            if (searchResults.length) {
                $(searchResults).show();
            }
        } else if ($(elem).attr('class') === 'artist-input' || $(elem).attr('class') === 'result' || $(elem).attr('class') === 'empty'){
            console.log('boohoo');
            prevTarget = elem;
            searchResults = $(elem).parent().find('.search-results');
            if (searchResults.length) {
                console.log('searh');
                $(searchResults).show();
            }
        } else {
            prevTarget = elem;
            elem = $(elem).parent();
            searchResults = $(elem).find('.search-results');
            $(searchResults).hide();
        }
    })
}

let prevTarget;

$(document).ready(checkClick)

// $(document).ready(function() {
//     $('.artist-input').on('input', function () {
//         let search = $(this).val()
//         if (search != '') {
//             $('#search-result').show();
//             $.getJSON($SCRIPT_ROOT + '/ajax/search_artist', {
//             artist: search
//             }, function(data) {
//                 data = data['artists']
//                 let len = data.length;
//                 $('#search-result').empty();
//                 if (data.length !== 0) {
//                     for (let i = 0; i < len; i++) {
//                         let name = data[i]['name'];
//                         $('#search-result').append("<p class='result' value='" + name + "'>" + name + "</p>");
//                     }
//                     $('#search-result li .result').bind('click', function () {
//                         console.log($(this).parent().parent());
//                     })
//                 } else {
//                     $('#search-result').append("<p value='empty' class='empty'>No Results Found</p>");
//                 }
//             })
//         } else {
//             $('#search-result').empty();
//         }
//     });
//     $(document).click(function(e) {
//         let elem = e.target;
//         if ($(elem).attr('class') === 'result' || $(elem).attr('class') === 'empty') {
//             return false;
//         } else {
//             $('#search-result').hide();
//         }
//     })
// })



