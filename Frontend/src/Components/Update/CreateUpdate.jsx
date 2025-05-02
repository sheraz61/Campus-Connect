import React from 'react';
import CreateForm from '../Common/CreateForm';

function CreateUpdate({ updateTrigger, setUpdateTrigger, setIsCreatePost, isCreatePost }) {
    return (
        <CreateForm
            type="update"
            title="Submit Post"
            imageField="postImage"
            apiEndpoint="posts"
            redirectPath="/update"
            updateTrigger={updateTrigger}
            setUpdateTrigger={setUpdateTrigger}
            setIsCreatePost={setIsCreatePost}
            isCreatePost={isCreatePost}
        />
    );
}

export default CreateUpdate;