var config = {
    apiKey: "AIzaSyArGGdSj3b3Ch935x_Zft1NaHem4zjdFtc",
    authDomain: "makeimpact-35311.firebaseapp.com",
    databaseURL: "https://makeimpact-35311.firebaseio.com",
    storageBucket: "makeimpact-35311.appspot.com",
};

var fbApp = firebase.initializeApp(config);
var fbRef = firebase.database().ref();

$(document).ready(function() {
    $.material.init();//start material effect

    //setup listener for firebase data change
    fbRef.child('traits').on('value', function(snap) {
        $.each(snap.val(), function(key, val) {
            var panelListItem = $('#panelListItem');
            if(!key) {
                //empty object
                panelListItem.text('No Content Available');
            } else {
                var html = '<div class="list-group-item">' +
                                '<div class="row-action-primary">' +
                                    '<i class="material-icons">grade</i>' +
                                '</div>' +
                                '<div class="row-content">' +
                                    '<div class="least-content">' +
                                          '<a href="/editTrait/'+ key +'"><i class="material-icons text-primary">mode_edit</i></a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                                          '<a href="#"><i class="material-icons text-danger">delete</i></a>' +
                                    '</div>' +
                                    '<h4 class="list-group-item-heading">'+ val.title +'</h4>' +

                                    '<p class="list-group-item-text">'+ val.description +'</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="list-group-separator"></div>';
                panelListItem.append(html);
            }
        });//end foreach
    });//end listener

    $('#newTraitForm').submit(function(e) {
        e.preventDefault();
    }).validate({
        submitHandler: submitNewTrait
    });
});

function submitNewTrait(form) {
        //grab all input value from form
        var data = $(form).serialize();

        $.ajax('/api/createNewTrait', {
            type: 'POST',
            data: data,
            dataType: 'json'
        }).done(function(data) {
            if (data.success) {
                $(location).attr('href', '/traits');
            } else {
                console.log(data);
            }
        });

        return false;
    }
