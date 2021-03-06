# Holler :cherry_blossom:

Holler is a full-stack, Facebook Messenger-inspired, peer-to-peer messaging application utilizing a Ruby on Rails/PostgreSQL backend and a React.js/Redux frontend. Its live messaging feature is powered by WebSockets, integrated into the application using Rails ActionCable technology. Other features include real-time messaging, stickers/gifs, image uploading, etc.

This project was proposed, designed, and built within two weeks, with the following minimum viable product goals in mind:

- User Authentication (backend and frontend)
- Direct Conversations
- Group Conversations
- Live Chat
- Emojis/GIFs

The aforementioned goals were reached, however, due to the time constraint, I was not able to implement additional features I had initially wanted to. I do plan on adding more to this project at a later time. (Please see [Potential Future Features](#potential-future-features).)

## Demo:
Experience the [live demo](https://holler-messenger.herokuapp.com/).

## Technologies Used
- Ruby on Rails/PostgreSQL — backend
- React.js/Redux — frontend
- User Authentication — from frontend to backend, using BCrypt
- Rails ActionCable — implement WebSockets for real-time, peer-to-peer messaging
- jQuery — XHR requests
- AWS (Amazon Web Services) — image uploading
- HTML/CSS/SCSS — frontend design
- GIPHY API — stickers and gifs

## Features and Functionality:
- design based on Facebook Messenger
- creating direct and/or group conversations
- communicating via real-time messages (utilizing **WebSockets**)
- sending stickers and gifs (courtesy of **GIPHY API**)
- changing the conversation name
- uploading images (via **Amazon Web Services**)
- other features to be implemented in the future

## Implementation

### WebSockets Using Rails ActionCable
When a conversation is mounted or loaded on the frontend, an ActionCable chatroom is set up based on the `conversationId`.

```javascript
class MessageView extends React.Component {
  setUpChatroom(convId, receiveMessage) {
    const chatroom = ActionCable.createConsumer();
    chatroom.subscriptions.create({
      channel: 'ChatChannel',
      room: `chat-${convId}`,
    }, {
      connected: function() {},
      disconnected: function() {},
      received: ({ payload }) => {
        receiveMessage(payload)
      },
    });
  };
}
```

Once a user submits a message (or sticker/gif), a jQuery `$.ajax POST request` is sent to the backend, creating the message. The created message is then broadcasted back to the Redux frontend. Any user subscribed to the chatroom will be able to see the chat live update.

``` ruby
class MessageCreationEventBroadcastJob < ApplicationJob
  queue_as :default

  def perform(message)
    ActionCable.server.broadcast(
      ("chat-#{message.conversation_id}"),
      payload: ActiveSupport::JSON.decode(render_message(message))
    )
  end

  private

  def render_message(message)
    ApplicationController.render(
      partial: 'api/messages/action_message',
      locals: { message: message }
    )
  end
end
```

Sample XHR response:

```javascript
{
  "message": {
    "id":45,
    "senderId":2,
    "conversationId":1,
    "body":"https://media0.giphy.com/media/jU9rKpLMLRXPO/200.gif?cid=e1bb72ff5ad1201d48622e45452710d3",
    "messageType":"Giphy",
    "timestamp":"APR 13, 2:25PM"
  },
  "messageIds": [31,32,33,34,35,36,37,38,39,40,41,42,43]
}
```

Depending on the `messageType`, a `text` message or `img` message will be rendered in the chatroom.

### GIPHY APIs
Users can also send Stickers and/or GIFs for additional personalized messages (and increased cuteness level), thanks to the GIPHY's APIs. The following endpoints were used for this project:

- GIPHY Trending Endpoint
- GIPHY Search Endpoint
- Sticker Trending
- Sticker Search

Depending on if the user has typed in a search query, the jQuery `$.ajax GET request` would fetch data from different endpoints.

```javascript
export const fetchGiphys = (query, offset) => {
  let url = (query === "") ? "trending" : "search";
  return (
    $.ajax({
      method: 'GET',
      url: `https://api.giphy.com/v1/gifs/${url}`,
      data: {
        q: query,
        limit: 5,
        offset: offset,
        api_key: "*************"
      }
    })
  );
};
```

![GIF Demo](https://media.giphy.com/media/7zrZcWYRcinuWTtgPz/giphy.gif)

![Sticker API Demo](https://media.giphy.com/media/9JtCgA94Ls4MaxTVrZ/giphy.gif)

### Keeping Code DRY
In order to keep code DRY and avoid duplicating HTML, a single component would be shared by multiple similar components. This is the case for the login/signup session forms, as well as the expressions component (Stickers/GIFs).

## Potential Future Features
- [ ] add users to existing conversations
- [ ] send images as messages (other than stickers/gifs)
- [ ] display `...` bubble when someone is typing
- [x] display message timestamp on hover
- [ ] users can react to messages
- [ ] update user image
