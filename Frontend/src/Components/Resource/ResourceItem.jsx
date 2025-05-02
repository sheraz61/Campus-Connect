import React from 'react'
import CardItem from '../Common/CardItem'

function ResourceItem({ title, discription, paperImg, owner, _id, semester }) {
    return (
        <CardItem
            title={title}
            description={discription}
            image={paperImg}
            owner={owner}
            _id={_id}
            semester={semester}
            type="resource"
        />
    )
}

export default ResourceItem
