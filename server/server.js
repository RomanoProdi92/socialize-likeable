import { LikesCollection } from '../common/like-model';

LikesCollection.allow({
    insert(userId, like) {
        // allow liking to occur if a user is logged in, the current user added the like, and they haven't already liked the object
        return userId && like.checkOwnership() && !like.isDuplicate();
    },
    remove(userId, like) {
        // allow unliking if there is a current user and the current user was the one who liked the object
        return userId && like.checkOwnership();
    },
});

LikesCollection.after.insert(function afterInsert(userId, like) {
    // after a successful like, increment the linked object's _likeCount property
    const collection = this.transform().getCollectionForParentLink();
    if(like.direction==1){
     userId && collection && collection.update(like.linkedObjectId, { $inc: { _likeCount: 1 } });
    }else{
     userId && collection && collection.update(like.linkedObjectId, { $inc: { _unlikeCount: 1 } });
    }
});
