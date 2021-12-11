const userid = document.getElementById("userid");
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const username = document.getElementById("username");
const message = document.getElementById("message");
const messageout = document.getElementById("messageout");

btn.addEventListener("click", function () {
  if (input.value) {
    socket.emit("message", { user: userid.innerText, msg: input.value });
    const html =
        `<div class="message-data text-right">
        <span class="message-data-time"></span>
        <img src="https://bootdey.com/img/Content/avatar/avatar7.png"
            alt="avatar">
    </div>
    <div class="message other-message float-right">
        ${input.value}
    </div>`;
    var item = document.createElement("li");
    item.className = "clearfix"
    item.innerHTML = html;
    message.appendChild(item);
    input.value = '';
    window.scrollTo(0, document.body.scrollHeight);
  }    
});

socket.on("remessage", (data) => {
    console.log(data.message)
    const html = `
        <div class="message-data">
            <span class="message-data-time"></span>
        </div>
        <div class="message my-message">
            ${data.message}
            
        </div>`;
    var item = document.createElement("li");
    item.className = "clearfix"
    item.innerHTML = html;
    message.appendChild(item);
    function play() {
        var audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
        audio.play();
    }
    play()
    window.scrollTo(0, document.body.scrollHeight);
  
});
