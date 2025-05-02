import React from 'react'
import CardItem from '../Common/CardItem'

function UpdateItem({ title, discription, postImg, owner, _id }) {
    return (
        <CardItem
            title={title}
            description={discription}
            image={postImg}
            owner={owner}
            _id={_id}
            type="update"
        />
    )
}

export default UpdateItem
