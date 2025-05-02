import React from 'react';
import DetailView from '../Common/DetailView';

function ResourceDetails() {
    return (
        <DetailView
            type="resource"
            apiEndpoint="papers"
            editPath="/edit-res"
            redirectPath="/resource"
            additionalFields={[
                {
                    name: 'semester',
                    label: 'Semester'
                }
            ]}
        />
    );
}

export default ResourceDetails;