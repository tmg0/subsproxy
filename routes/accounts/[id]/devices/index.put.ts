export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return sendRedirect(event, `/accounts/${id}/servers?encode=true`)
})
