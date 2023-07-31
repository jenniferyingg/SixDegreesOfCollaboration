'use client'

const handleChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    LogKid(value);
  }
  
  function LogKid(kid: string) {
    console.log('you chose %s', kid)
  }
  

  export default function Main() {

    return (
      <main>
        <div className = "centre">
          <div className = "hcentre">
          <p>Pick a kid!</p>
          </div>
          <div className = "boxed">
            <select name = "kids" id = "kid-selector" onChange={handleChange}>
              <option value = "benson">Benson</option>
              <option value = "gerald">Gerald</option>
              <option value = "poot">Poot</option>
              <option value = "pongo">Pongo</option>
              <option value = "axel">Axel</option>
              <option value = "bean">Bean</option>
              <option value = "remy">Remy</option>
              <option value = "moop">Moop</option>
              <option value = "flop">Flop</option>
              <option value = "dingbits">Dingbits</option>
              <option value = "gillbert">Gillbert</option>
              <option value = "carrot">Carrot</option>
            </select>
          </div>
        </div>
      </main>
    )
  }
