$(document).ready(function() {
    $.material.init();//start material effect

    var castsRowSpinner = $('#castsRowSpinner');
    //show casts row spinner
    castsRowSpinner.show();

    var movieId = $('#movieId').val();

    //get casts related to this movie
    var castsUrl = 'https://api.themoviedb.org/3/movie/' + movieId + '/credits?api_key=1bd3f3a91c22eef0c9d9c15212f43593';
    $.get(castsUrl, function (casts) {
        var topFiveBilledCasts = casts.cast.slice(0, 4);
        // console.log(topFiveBilledCasts);
        
        populateCastsInfo(topFiveBilledCasts);
        
    });

    function populateCastsInfo(casts) {
        var castsRow = $('#castsRow');

        $.each(casts, function (index, castObj) {
            var singleCastTemplate =    '<div class="col-md-3">' +
                '<img src="https://image.tmdb.org/t/p/w264_and_h264_bestv2/'+castObj.profile_path+'"'+' class="img-circle center-block" width="150" height="150">' +
                '<p class="text-center text-muted"><b>'+ castObj.name +'</b></p>' +
                '<p class="text-center">'+ castObj.character +'</p>'
            '</div>';

            castsRow.append(singleCastTemplate);
        });

        castsRowSpinner.hide();

    }

    //get comments related to this movies
    $.get('/movie/'+movieId+'/comments', function(comments) {
        populateComments(comments);
    });

    function populateComments(comments) {
        var displayCommentsPanel = $('#displayComments');
        console.log(comments);
        $.each(comments, function(index, comment) {
            var commentBlock =      `<div class="main-comment-block commentBlock">
                                        <input type="hidden" class="parentCommentId" name="parentCommentId" value= ${comment._id} />
                                        <blockquote>
                                            ${comment.content}
                                            <footer>By Someone</footer>
                                            <a class="btn btn-info replyCommentBtn">Reply</a>
                                        </blockquote><hr>
                                     </div>`;

            displayCommentsPanel.append(commentBlock);

            if(comment.subComments.length > 0) {

                $.each(comment.subComments, function(k, subComment) {
                    console.log('sub comment: ' + subComment.content);
                    var subCommentBlock =   `<div class="sub-comment-block commentBlock">
                                                <input type="hidden" class="parentCommentId" name="parentCommentId" value= ${comment._id} />
                                                <blockquote>
                                                    ${subComment.content}
                                                    <footer>By Someone</footer>
                                                    <a class="btn btn-info replyCommentBtn">Reply</a>
                                                </blockquote><hr/>                                 
                                             </div>`;

                    displayCommentsPanel.append(subCommentBlock);
                });
            }
        });
    }

    //handle click event when reply button is clicked
    $('#displayComments').on('click', '.replyCommentBtn', function(e) {
        e.preventDefault();
        //hide every reply form first
        $('.subCommentForm').hide(300);

        var subCommentForm =    `<form class="form-horizontal subCommentForm">
                                    <input type="hidden" name="movieId" value= ${movieId} />
                                    <div class="form-group">
                                        <div class="col-sm-10 col-sm-offset-1 form-border">
                                            <textarea name="subComment" class="form-control" id="" rows="3" placeholder="Enter your comment here..." required minlength="5"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-3 pull-right">
                                        <input type="submit" value="Reply" class="btn btn-info btn-raised"/>
                                    </div>
                                 </form>`;

        $(this).closest('.commentBlock').append(subCommentForm);

    });

    $('#displayComments').on('submit', '.subCommentForm', function(e) {
        e.preventDefault();
        var that = $(this);
        var parentCommentId = $(this).siblings('.parentCommentId').first().val();

        var data = $(this).serialize();
        $.ajax('/movie/' + movieId + '/comment/' + parentCommentId, {
            type: 'POST',
            data: data,
            dataType: 'json'
        }).done(function(data) {
            populateNewSubComment(data, that);
        });
    });

    function populateNewSubComment(subComment, subCommentForm) {
        var subCommentBlock =   `<div class="sub-comment-block commentBlock">
                                    <input type="hidden" class="parentCommentId" name="parentCommentId" value= ${subComment.parentCommentId} />
                                    <blockquote>
                                        ${subComment.content}
                                        <footer>By Someone</footer>
                                        <a class="btn btn-info replyCommentBtn">Reply</a>
                                    </blockquote><hr/>                                 
                                 </div>`;

        // subCommentForm.before(subCommentBlock);
        subCommentForm.closest('.main-comment-block').append(subCommentBlock);
        subCommentForm.hide();
    }



    //handle comments
    $('#commentForm').on('submit', function(e) {
        e.preventDefault();
        var that = $(this);
        var data = $(this).serialize();

        $.ajax('/movie/'+movieId+'/comment', {
            type: 'POST',
            data: data,
            dataType: 'json'
        }).done(function(data) {
            var commentBlock = `<div class="main-comment-block commentBlock">
                                    <input type="hidden" class="parentCommentId" name="parentCommentId" value= ${data._id} />
                                    <blockquote>
                                        ${data.content}
                                        <footer>By Someone</footer>
                                        <a class="btn btn-info replyCommentBtn">Reply</a>
                                    </blockquote><hr>
                                 </div>`;

            //reset form
            that[0].reset();
            $('#displayComments').append(commentBlock);
        });

    });

});



