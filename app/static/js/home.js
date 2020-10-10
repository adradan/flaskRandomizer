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
            remainingInput[i].parentElement.setAttribute('id', `artist-div-${prevIndex - 1}`);
        } else {
            continue;
        }

    }
    if (deletedIndex === 1) {
        let brs = form.querySelectorAll('br');
        brs[0].remove();
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

function findResults(e) {
    let search = $(this).val();
}

function checkClick() {
    let currentBox;
    $(document).on('input', '.artist-input', function(e) {
        currentBox = e.target;
        let divElem = $($(currentBox).next()[0]).next();
        if (divElem[0]) {
            null;
        } else {
            divElem = $($(currentBox).next()[0]).after('<div class="search-results">');
        }
        findResults(e.target);
    });
    $(document).click(function(e) {
        let elem = e.target;
        if ($(elem).attr('class') === 'artist-input' || $(elem).attr('class') === 'result' || $(elem).attr('class') === 'empty') {
            return false;
        } else {
            console.log('clicked document')
        }
    })
}

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



