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
      send(text);
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

    prepBotResponse();
    scrollToBottomOfResults();



    // $('.suggestion').remove();
  }

  //--- Call the RASA API---
  function send(text) {
    console.log("Call Rasa=" + text);

    $.ajax({
      url: 'http://localhost:5002/webhooks/rest/webhook', //  RASA API // 206.189.37.110
      type: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "sender": "user",
        "message": text
      }),
      success: function (data, textStatus, xhr) {
        console.log(data);

        setBotResponse(data);
      },
      error: function (xhr, textStatus, errorThrown) {
        setBotResponse('error');
      }

    });
  }

  //--- Set bot response in kmbot_chat_timeline ---
  function prepBotResponse(val) {

    var BotResponse = getBotResponseTemplate();

    $(BotResponse).appendTo('#kmbot_chat_conversation');
    showSpinner();
    scrollToBottomOfResults();

  }

  function getBotResponseTemplate() {
    var html =
    `<div class="kmbot-chat-message kmbot-chat-automatic-message
      kmbot-chat-message-someone-else kmbot-chat-spinner"
      id="kmbot_chat_timeline_item_${Date.now()}">
      ${getAvatarTemplate('bot')}
    <div class="kmbot-chat-message-body" dir="ltr"">
      ${getSpinnerTemplate()}
    </div>
    </div>`;

    return html;
  }

  function getSpinnerTemplate() {
    var html =
    `<div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>`;

    return html;
  }

  function getAvatarTemplate(type) {
    var html = '';
    if (type == 'bot') {
      html =
      `<div class="kmbot-chat-message-identity-avatar">
        <img src="./image/Telenor_Logo.png" alt="avatar">
      </div>`;
    }

    return html;
  }

  function setBotResponse(val) {

    setTimeout(function () {
      if ($.trim(val) == '' || val == 'error') {
        console.log("----error!!!----");
        var err_msg = 'Sorry I wasn\'t able to understand your Query. Let\' try something else!';
        var BotResponse =
        `<div>${err_msg}</div>`;

        // Add error message to spinner div
        $(BotResponse).appendTo('.kmbot-chat-spinner');
      } else {
        // Format message from bot
        var msg = "";
        for (var i = 0; i < val.length; i++) {
          if (val[i]["image"]) { //check if there are any images
            msg += '<p class="botResult"><img  width="100%" src="'
                + val[i].image +
                '"></p><div class="clearfix"></div>';
          } else {
            msg += '<p class="botResult">' + val[i].text + '</p><div class="clearfix"></div>';
          }

        }

        BotResponse = msg;
        $(BotResponse).appendTo('#kmbot_chat_conversation');

      }
      // Remove spinner and whole div
      $("div.kmbot-chat-spinner").remove()

    }, 500);



  };

  //--- Scroll to the bottom of kmbot_chat_timeline ---
  function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById('kmbot_chat_conversation');
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
  }

  //--- Spinner ---
  function showSpinner() {
    $('.spinner').show();
  }

  function hideSpinner() {
    $('.spinner').hide();
  }

});
