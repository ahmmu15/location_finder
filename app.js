// listen for submit
document.querySelector('#zipForm').addEventListener('submit', getLocationInfo);

// listen for close button
document.querySelector('body').addEventListener('click', closeLocation);

function getLocationInfo(e) {
    e.preventDefault();
    
    // get zip value from input
    const zip = document.querySelector('.zip').value;
    
    // make request
    fetch(`http://api.zippopotam.us/us/${zip}`)
        .then(response => {
            // check if the entered zip code is valid
            if(response.status != 200){

                // show the remove icon
                showIcon('remove');

                // output the error to the dom
                document.querySelector('#output').innerHTML =
                `
                <article class="message is-danger">
                    <div class="message-body">Invalid ZIP code, please try again</div>
                </article>  
                `;

                throw Error(response.statusText);
            } else {
                // show the correct icon
                showIcon('check');

                return response.json()
            }
        })
        .then(data => {
            // loop throw the data and output it to dom
            let output = '';

            data.places.forEach(place => {
                output += `
                    <article class="message is-primary">
                        <div class="message-header">
                            <p>Location info</p>
                            <button class="delete"></button>
                        </div>
                
                        <div class="message-body">
                            <ul>
                                <li><strong>City: </strong> ${place['place name']}</li>
                                <li><strong>State: </strong> ${place['state']}</li>
                                <li><strong>Longitude: </strong> ${place['logitude']}</li>
                                <li><strong>Latitude: </strong> ${place['latitude']}</li>
                            </ul>
                        </div>
                    </article>
                `
            });

            // insert into the output div
            document.querySelector('#output').innerHTML = output;
        })
        .catch(err => console.log(err));
}

// show check or remove icon
function showIcon(icon) {
    // clear icons first
    document.querySelector('.icon-remove').style.display = 'none';
    document.querySelector('.icon-check').style.display = 'none';

    // show the correct icon
    document.querySelector(`.icon-${icon}`).style.display = 'inline-flex';
}

// close location box
function closeLocation(e) {
    // check if the thing we click on is indeed the close btn
    if(e.target.className == 'delete') {
        document.querySelector('.message').remove();
        document.querySelector('.zip').value = '';
        document.querySelector('.icon-check').remove();
    }
}