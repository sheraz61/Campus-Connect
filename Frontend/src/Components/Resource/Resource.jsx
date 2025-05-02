import React from 'react';
import ResourceItem from './ResourceItem';
import ContentList from '../Common/ContentList';

function Resource() {
    return (
        <ContentList
            type="resource"
            apiEndpoint="papers"
            ItemComponent={ResourceItem}
            emptyMessage="No papers found"
            loginMessage="Please login to view papers"
        />
    );
}

export default Resource;