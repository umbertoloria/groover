export const fetchDrumsFromPublic = (filename: string) => fetch(`/resources/${filename}`)
    .then((res) => res.text())
