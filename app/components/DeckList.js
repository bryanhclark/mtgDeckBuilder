import React from 'react'



const DeckList = (props) => {
    return (
        <div id='deckList'>
            {
                props.deckList.map(card =>
                    (
                        <div key={card.multiverseid} className='cardView'>
                            <img src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`} />
                            <p >{card.name}</p>
                        </div>
                    ))
            }


        </div>
    )
}

export default DeckList;