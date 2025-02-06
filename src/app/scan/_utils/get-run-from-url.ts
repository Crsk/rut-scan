export const getRunFromUrl = (url: string) => {
  const params = new URL(url).searchParams

  return params.get('RUN')
}
