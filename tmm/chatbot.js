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

});
