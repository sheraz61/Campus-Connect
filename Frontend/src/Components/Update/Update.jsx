import React from 'react';
import UpdateItem from './UpdateItem';
import ContentList from '../Common/ContentList';

function Update() {
    return (
        <ContentList
            type="update"
            apiEndpoint="posts"
            ItemComponent={UpdateItem}
            emptyMessage="No posts available"
            loginMessage="Please Login First Then See the Updates"
        />
    );
}

export default Update;