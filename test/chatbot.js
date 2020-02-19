$(document).ready(function () {
  // Cookie
  var cookieName = "km_bot_uuid";
  var cookieDuration = 365 * 24 * 60 * 60 * 1000; // 365 days

  // --- Toggle chatbot ---

  // -- Open bot from icon
  $('.kmbot_chat_button').click(function () {
    console.log("Khin Min bot open");
    $('.kmbot_chat_button').toggle();
    $('.kmbot-chat-wrapper').toggle();

    startBot();

    document.getElementById('kmbot_chat_textarea').focus();
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

  });

  // -- Switch bot to Live Chat
  function switchToLiveChat() {
    console.log("Switch to Live Chat!");

    $('.kmbot-chat-wrapper').remove();
    $('.kmbot_chat_button').remove();

    var cm = document.createElement('scr' + 'ipt'); cm.type = 'text/javascript'; cm.async = true;
    cm.src = ('https:' == document.location.protocol ? 'https://' : 'https://') + 'telenor.dimelochat.com/chat/9da84e3e5b88b0a55d6e9518/loader.js';
    var s = document.getElementsByTagName('scr' + 'ipt')[0]; s.parentNode.insertBefore(cm, s);


  };
  // --- Start bot ---
  function startBot() {
    prepBotResponse();
    send('/i_greet');
    scrollToBottomOfResults();
  }

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

    $('.suggestion').remove();

    var UserResponse =
    `<div class="kmbot-chat-message kmbot-chat-message-self">
      <div class="kmbot-chat-message-body" dir="ltr">${val}</div>
    </div>`;

    $(UserResponse).appendTo('#kmbot_chat_conversation');
    $("#kmbot_chat_textarea").val('');

    prepBotResponse();
    scrollToBottomOfResults();

  }

  function createUUID() {
    var dt = new Date().getTime();
    var r = Math.random()*10000000000;
    r = Math.floor(r);
    var uuid = dt + "-" + r;

    return uuid;
  }

  function setCookie(cname, cvalue, expire_duration) {
  var d = new Date();
  console.log("Now=" + d.toUTCString());
  d.setTime(d.getTime() + expire_duration);
  var expires = "expires=" + d.toUTCString();

  console.log("Cookie expires = " + expires);
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var uuid = getCookie(cookieName);

  if (uuid == "") {
    uuid = createUUID();
    setCookie(cookieName, uuid, cookieDuration);
  }
  return uuid;
}

  //--- Call the RASA API---
  function send(text) {
    uuid = checkCookie();
    console.log(uuid + ": Call Rasa=" + text);

    $.ajax({
      url: 'http://localhost:5002/webhooks/rest/webhook', //  RASA API // 206.189.37.110
      type: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "sender": uuid,
        "message": text
      }),
      success: function (data, textStatus, xhr) {
        console.log(data);

        // Format buttons
        if (Object.keys(data).length !== 0) {
          // Loop each return
          for (i = 0; i < Object.keys(data).length; i++) {
            var data_detail = data[i];

            // Loop each attribute
            Object.keys(data_detail).forEach(function(key) {
              var value = data_detail[key];
              if (key == "buttons" && value) {
                // console.log("---- " + key +": "+ value);
                addSuggestion(value)
              }
            })

          }
        }

        setBotResponse(data);
        setTimeResponse();

      },
      error: function (xhr, textStatus, errorThrown) {
        setBotResponse('error');
      }

    });
  }

  //--- Set bot response in kmbot_chat_timeline ---
  function prepBotResponse(val) {

    var BotResponse = getBotSpinnerTemplate();

    // Remove previous timestamp
    $("div.kmbot-chat-timestamp").remove();
    $(BotResponse).appendTo('#kmbot_chat_conversation');

  }

  function getBotResponseTemplate(message_body) {
    var html =
    `<div class="kmbot-chat-message kmbot-chat-automatic-message
      kmbot-chat-message-someone-else"
      id="kmbot_chat_timeline_item_${Date.now()}">
      ${getAvatarTemplate('bot')}
      <div class="kmbot-chat-message-body" dir="ltr"">
        ${message_body}
      </div>
    </div>`;

    return html;
  }

  function getBotSpinnerTemplate() {
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
        <img src="./image/bot_logo.png" alt="avatar">
      </div>`;
    }

    return html;
  }

  function setBotResponse(val) {

    setTimeout(function () {
      if ($.trim(val) == '' || val == 'error') {
        console.log("----error!!!----");
        var err_msg = 'Sorry I wasn\'t able to understand your Query. Let\' try something else!';
        var BotResponse = getBotResponseTemplate(err_msg);

        // Add error message to spinner div
        $(BotResponse).appendTo('#kmbot_chat_conversation');
      } else {
        // Format message from bot
        var msg = "";
        for (var i = 0; i < val.length; i++) {
          if (val[i]["image"]) { //check if there are any images
            message_body = '<p class="botResult"><img class="reply-image" width="100%" src="'
              + val[i].image +
              '"></p><div class="clearfix"></div>';
            msg += getBotResponseTemplate(message_body);

          } else if (val[i]["custom"]) { // Format custom response
            var customs = val[i]["custom"];
            var cusLength = customs.length;
            console.log("+++custom+++" + cusLength);

            for (var ii = 0; ii < cusLength; ii++) {
              console.log("---- Type = " + customs[ii].type);
              // Format Type
              if (customs[ii].type == "tel") {
                message_body = '<a href="tel:' + escape(customs[ii].text) + '">'
                  + customs[ii].text + '</a>';
                message_body = '<p class="botResult">' +
                  message_body + '</p><div class="clearfix"></div>';
              } else if (customs[ii].type == "url") {
                message_body = '<a href="' + escape(customs[ii].text) + '">'
                  + customs[ii].text + '</a>';
                message_body = '<p class="botResult">' +
                  message_body + '</p><div class="clearfix"></div>';
              } else {
                message_body = '<p class="botResult">' + customs[ii].text + '</p><div class="clearfix"></div>';
              }

              msg += getBotResponseTemplate(message_body);
            }
          } else {
            message_body = '<p class="botResult">' + val[i].text + '</p><div class="clearfix"></div>';
            msg += getBotResponseTemplate(message_body);
          }

        }

        var BotResponse = msg;
        $(BotResponse).appendTo('#kmbot_chat_conversation');

      }
      // Remove spinner and whole div
      removeSpinner();

      scrollToBottomOfResults();
      document.getElementById('kmbot_chat_textarea').focus();
    }, 500);



  };

  function setTimeResponse() {
    setTimeout(function () {
      var d = new Date();

      var TimeResponse = `
        <div data-timestamp="${Date.now()}" class="kmbot-chat-timestamp">
          <p>${d.toLocaleTimeString()}</p>
          <span></span>
        </div>`;
      $(TimeResponse).appendTo('#kmbot_chat_conversation');

      scrollToBottomOfResults();
    }, 1000);


  }

  //--- Scroll to the bottom of kmbot_chat_timeline ---
  function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById('kmbot_chat_conversation');
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;

  }

  //--- Spinner ---
  function removeSpinner() {
    $("div.kmbot-chat-spinner").remove();
  }

  //--- Buttons(suggestions)---
  function addSuggestion(textToAdd) {
    setTimeout(function () {
      var suggestions = textToAdd;
      console.log("+++addSuggestion+++");
      var suggLength = textToAdd.length;
      $('<p class="suggestion"></p>').appendTo('#kmbot_chat_conversation');
      // Loop through suggestions
      for (i = 0; i < suggLength; i++) {
        // Format image
        var suggValue = "";
        if (suggestions[i].image) {
          suggValue = `
          <div><img class="reply-image" src="${suggestions[i].image}">${suggestions[i].title}</div>`;
        } else {
          suggValue = suggestions[i].title;
        }

        $('<span class="sugg-options" intent="' + suggestions[i].payload + '" >'
        + suggValue + '</span>').appendTo('.suggestion');
      }

      scrollToBottomOfResults();
    }, 700);

  }

  // on click of suggestions get value and send to API.AI
  $(document).on("click", ".suggestion span", function () {
    var text = this.innerText;
    var intent = this.attributes["intent"].value;
    console.log("--On Click--");
    console.log(intent)

    $('.suggestion').remove();

    // Check if request to Live Chat intent = /i_request_live_chat
    if(intent == '/i_request_live_chat') {
      switchToLiveChat();
    } else {
      setUserResponse(text);
      send(intent);
    }

  });

});
