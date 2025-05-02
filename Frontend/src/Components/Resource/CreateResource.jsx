import React from 'react';
import CreateForm from '../Common/CreateForm';

function CreateResource({ isCreatePost, setIsCreatePost, setUpdateTrigger, updateTrigger }) {
    return (
        <CreateForm
            type="resource"
            title="Submit Resource"
            imageField="paperImage"
            apiEndpoint="papers"
            redirectPath="/resource"
            additionalFields={[
                {
                    name: 'semester',
                    label: 'Semester',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter Semester'
                }
            ]}
            updateTrigger={updateTrigger}
            setUpdateTrigger={setUpdateTrigger}
            setIsCreatePost={setIsCreatePost}
            isCreatePost={isCreatePost}
        />
    );
}

export default CreateResource;