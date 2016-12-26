using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;
using System.Collections.Generic;
using System.Linq;
using Angular2Application1.Models;
namespace SignalRCore.Hubs.HelloHub
{


    //   [HubName("hello")]
    public class HelloHub : Hub<IHelloHub>
    {
        static List<User> Users = new List<User>();

        bool ПользовательЗарегистрирован(User user)
        {

            var curId = Context.ConnectionId;

            var имя = Users.Where(x => x.ConnectionId == curId).Select(x => x.Name).SingleOrDefault();
            user.Name = имя;
            user.ConnectionId = curId;
            return (!String.IsNullOrWhiteSpace(имя));




        }


        // Отправим сообщения всем пользователям, кроме отсылающего если Кому пустая строка
        // Если Кому определен, то отправим конкретному пользователю и ID Кому
        public async Task sendEcho(string str, string Кому)
        {
            var user = new User();
            if (!ПользовательЗарегистрирован(user))
                return;

            if (string.IsNullOrWhiteSpace(Кому))
                await Clients.Others.addMessage(user.Name, str, user.ConnectionId);
            else
                await Clients.Client(Кому).addMessage(user.Name, str, user.ConnectionId);
        }


        // Отправим сообщение с определенным именем
        // Найдем всех пользователей с этим именем и каждому отправимсообщение 
        public async Task sendByName(string str, string Кому)
        {
            var user = new User();
            if (!ПользовательЗарегистрирован(user))
                return;




            foreach (var клиент in Users.Where(x => x.Name.ToUpper() == Кому.ToUpper()).Select(x => x.ConnectionId))
                await Clients.Client(клиент).addMessage(user.Name, str, user.ConnectionId);
        }



        // Отправка сообщений всем пользователям в том числе и отправителю.
        public async Task send(string name2, string message)
        {
            var user = new User();
            if (!ПользовательЗарегистрирован(user))
                return;

            await Clients.All.addMessage(user.Name, message, user.ConnectionId);
        }


        // Отправка файла пользователю
        public async Task sendFile(string Кому, string FileName, byte[] Data, bool isCompressed)
        {
            var user = new User();
            if (!ПользовательЗарегистрирован(user))
                return;


            if (Users.Any(x => x.ConnectionId == Кому))
            {
                await Clients.Client(Кому).getFile(user.Name, FileName, user.ConnectionId, new DataInfo(Data, isCompressed));
            }

        }


        // Отправка данных для вычисления команды
        public async Task evaluteCommand(string Кому, string command, byte[] Data, bool isCompressed)
        {
            var user = new User();
            if (!ПользовательЗарегистрирован(user))
                return;


            if (Users.Any(x => x.ConnectionId == Кому))
            {
                await Clients.Client(Кому).evaluteCommand(user.Name, command, user.ConnectionId, new DataInfo(Data, isCompressed));
            }

        }


        // Отправить результат команды 
        public async Task resultCommand(string Кому, string command, byte[] Data, bool isCompressed)
        {
            var user = new User();
            if (!ПользовательЗарегистрирован(user))
                return;


            if (Users.Any(x => x.ConnectionId == Кому))
            {
                await Clients.Client(Кому).resultCommand(user.Name, command, user.ConnectionId, new DataInfo(Data, isCompressed));
            }

        }
        // Подключение нового пользователя
        // И отправка ему данных о подключенных пользователях
        public async Task connect(string userName)
        {
            var id = Context.ConnectionId;


            if (!Users.Any(x => x.ConnectionId == id))
            {
                Users.Add(new User { ConnectionId = id, Name = userName });

                // Посылаем сообщение текущему пользователю
                await Clients.Caller.onConnected(id, userName, Users);

                // Посылаем сообщение всем пользователям, кроме текущего
                await Clients.AllExcept(id).onNewUserConnected(id, userName);

                // Тест отправки сообщения

                //  Clients.All.addMessage(userName, "Тестовое Сообщение", id);
            }
        }

        // Отключение пользователя
        // Сообщим всем пользователям об отключении, что бы скорректировать список пользователей
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var id = Context.ConnectionId;
            var item = Users.FirstOrDefault(x => x.ConnectionId == id);
            if (item != null)
            {
                Users.Remove(item);

                Clients.All.onUserDisconnected(id, item.Name);
            }

            return base.OnDisconnected(stopCalled);
        }
    }


}
