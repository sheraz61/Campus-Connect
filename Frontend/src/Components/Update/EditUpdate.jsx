import React from 'react';
import EditForm from '../Common/EditForm';

function EditUpdate() {
    return (
        <EditForm
            type="update"
            title="Edit Post"
            imageField="postImage"
            apiEndpoint="posts"
        />
    );
}

export default EditUpdate;
