import React from 'react';
import EditForm from '../Common/EditForm';

function EditResource() {
    return (
        <EditForm
            type="resource"
            title="Edit Resource"
            imageField="paperImage"
            apiEndpoint="papers"
            additionalFields={[
                {
                    name: 'semester',
                    label: 'Semester',
                    type: 'text',
                    required: true
                }
            ]}
        />
    );
}

export default EditResource;