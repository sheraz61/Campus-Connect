import React from 'react';
import DetailView from '../Common/DetailView';

function UpdateDetails() {
    return (
        <DetailView
            type="update"
            apiEndpoint="posts"
            editPath="/edit-post"
            redirectPath="/my-posts"
        />
    );
}

export default UpdateDetails;