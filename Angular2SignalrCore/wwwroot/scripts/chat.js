$(function () {
      $('#MainMessage').hide();
   // $('#MainMessage').show();
    var userId = "";

    var chat = $.connection.helloHub;
    // Объявление функции, которая хаб вызывает при получении сообщений

    

    chat.client.addMessage = function (name, message) {
        // Добавление сообщений на веб-страницу 
        AddMessage(name, message);
    };

    // Открываем соединение
    $.connection.hub.start().done(function () {


        // обработка логина
        $("#btnLogin").click(function () {

            var name = $("#txtUserName").val();
            if (name.length > 0) {

                chat.server.connect(name);
            }
            else {
                alert("Введите имя");
            }
        });

        $("#SendMessageBtn").click(SendMessage);





    });


    // Функция, вызываемая при подключении нового пользователя
    chat.client.onConnected = function (id, userName, allUsers) {

        $('#MainMessage').show();
        $('#loginBlock').remove();
        userId = id;
        // Добавление всех пользователей
        for (i = 0; i < allUsers.length; i++) {

            AddUser(allUsers[i].ConnectionId, allUsers[i].Name);
        }
    };

    // Добавляем нового пользователя
    chat.client.onNewUserConnected = function (id, name) {

        AddUser(id, name);
    };

    // Удаляем пользователя
    chat.client.onUserDisconnected = function (id, userName) {
        var Komu = $("#selectUser").children(".data-label");
        var idKomu = Komu.attr("data-my");
        if (idKomu === id) {
            Komu.attr("data-my", "");
            Komu.text("Всем");

        }
        $('#' + id).remove();
    };

    // Кодирование тегов
    function AddMessage(name, message) {
        if (userId === "") return;

        var str = $("<div class='panel panel-primary'><div class='panel-heading'>" + htmlEncode(name) + " от " + (new Date()).toLocaleString() + "</div><div class='panel-body'>" + htmlEncode(message) + "</div></div>");
        // var val= $
        $("#GetingMessage").prepend(str);

    }
    function SendMessage() {


        var message = $("#txtMessage").val();

        if (message.length > 0) {
            //  AddMessage("Вася",message);
            var Komu = $("#selectUser").children(".data-label");
            var nameKomu = Komu.text();
            var idKomu = Komu.attr("data-my");
            if (nameKomu === "Всем")
                chat.server.sendEcho(message, "");
            else if (!$("#CheckBoxSendByName").is(':checked'))
                chat.server.sendEcho(message, idKomu);
            else
                chat.server.sendByName(message, nameKomu);


            $('#txtMessage').val('');
        }
        else {
            alert("Введите сообщение");
        }

    }
    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
    //Добавление нового пользователя
    function AddUser(id, name) {
        if (userId === "") return;

        if (userId !== id) {
            var str = $("<li id=" + id + "><input name='ex4' id='List_" + id + "' type='radio' value='" + name + "'><label for='List_" + id + "'><span class='data-label' data-my='" + id + "'>" + name + "</span></label></li>");
            $("#UsersList").append(str);
        }
    }
});