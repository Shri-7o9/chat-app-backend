import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      // only required while the message hasn't been unsent — once unsent
      // we blank it out, and it must be allowed to save as ""
      required: function () {
        return !this.unsent;
      },
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    // the message this one is replying to, if any
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    isEdited: {
       type: Boolean, 
       default: false 
      },

    // true once the sender has unsent it — text/image get wiped but the row stays
    // so the UI can render "This message was deleted"
    unsent: {
      type: Boolean,
      default: false,
    },

    // per-user "delete for me" — hides the message only for these users
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // set when this message was created via the forward action
    forwarded: {
      type: Boolean,
      default: false,
    },

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        emoji: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;