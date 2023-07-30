type SongProps = {
    artistName: string
}

export const SongDisplay = ({ artistName }: SongProps) => {
    return <p>stupid artist, {artistName}</p>;
}  

