$(document).ready(function () {
  // --- Toggle chatbot ---

  // -- Open bot from icon
  $('.kmbot_chat_button').click(function () {
    console.log("Khin Min bot open");
    $('.kmbot_chat_button').toggle();
    $('.kmbot-chat-wrapper').toggle();

  });

  // -- Minimize bot from chat frame
  $('.kmbot-chat-control-close').click(function () {
    console.log("Khin Min bot minimized");
    $('.kmbot-chat-wrapper').toggle();
    $('.kmbot_chat_button').toggle();
  });

  // -- Close bot from chat frame
  $('.kmbot-chat-control-quit').click(function () {
    console.log("Khin Min bot quit");

    $('.kmbot-chat-wrapper').remove();
    $('.kmbot_chat_button').remove();

    var cm = document.createElement('scr' + 'ipt'); cm.type = 'text/javascript'; cm.async = true;
    cm.src = ('https:' == document.location.protocol ? 'https://' : 'https://') + 'telenor.dimelochat.com/chat/9da84e3e5b88b0a55d6e9518/loader.js';
    var s = document.getElementsByTagName('scr' + 'ipt')[0]; s.parentNode.insertBefore(cm, s);


  });

  // --- Input Text ---

  $('#kmbot_chat_control_send').click(function (e) {
    console.log("Text send!");
    var text = $("#kmbot_chat_textarea").val();
    if (text == "" || $.trim(text) == '') {
      e.preventDefault();
      return false;
    } else {
      $("#kmbot_chat_textarea").blur();
      setUserResponse(text);
      // send(text);
      e.preventDefault();
      return false;
    }

  });

  //--- Set user response in kmbot_chat_timeline ---
  function setUserResponse(val) {
    console.log("Input=" + val);

    var UserResponse =
    `<div class="kmbot-chat-message kmbot-chat-message-self">
      <div class="kmbot-chat-message-body" dir="ltr">${val}</div>
    </div>`;

    $(UserResponse).appendTo('#kmbot_chat_conversation');
    $("#kmbot_chat_textarea").val('');
    scrollToBottomOfResults();

    // ---------
    var Spinner = '<div class="spinner">' +
    '<div class="bounce1"></div>' +
    '<div class="bounce2"></div>' +
    '<div class="bounce3"></div>' +
    '</div>';
    $(Spinner).appendTo('#kmbot_chat_conversation');
    showSpinner();

    // -------

    $('.suggestion').remove();
  }

  //---------------------------------- Scroll to the bottom of the results div -------------------------------
  function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById('kmbot_chat_conversation');
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
  }

  //---------------------------------------- Spinner ---------------------------------------------------
  function showSpinner() {
    $('.spinner').show();
  }

  function hideSpinner() {
    $('.spinner').hide();
  }

});
