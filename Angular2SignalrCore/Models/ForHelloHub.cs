using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular2Application1.Models
{
    public class User
    {
        public string ConnectionId { get; set; }
        public string Name { get; set; }
    }

    public class DataInfo
    {
      public byte[] Data { get; set; }
      public bool isCompressed { get; set; }

     public DataInfo( byte[] Data, bool isCompressed)
        {

            this.Data = Data;
            this.isCompressed = isCompressed;
        

        }

        

    }
    public interface IHelloHub
    {

        // На клиенте независимо как названы методы на сервере
        //будет использоваться Camel нотация
        // поэтому все методы начинаем с прописных букв
        Task sendEcho(string str, string Кому);
        Task sendByName(string str, string Кому);
        Task send(string name2, string message);
        Task sendFile(string Кому, string FileName, DataInfo Data);


        Task evaluteCommand(string Кому, string command, DataInfo Data);


        Task resultCommand(string Кому, string command, DataInfo Data);

        // Подключение нового пользователя
        Task connect(string userName);

        // События Клиенту
       Task addMessage(string Name, string str, string ConnectionId);
       Task getFile(string Name, string FileName, string ConnectionId, DataInfo Data);
       Task evaluteCommand(string Name, string command, string ConnectionId, DataInfo Data);
        Task resultCommand(string Name, string command, string ConnectionId, DataInfo Data);
        Task onConnected(string id,string userName, List<User> users);

       Task onNewUserConnected(string id, string userName);

        Task onUserDisconnected(string id, string Name);
    }

}
