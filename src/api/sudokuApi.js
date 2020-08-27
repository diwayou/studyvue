import service from '@/utils/service'

const baseUrl = '/sudoku'

const sudokuApi = {}

sudokuApi.rooms = () => {
  return service({
    url: `${baseUrl}/rooms`,
    method: 'get'
  })
}

export default sudokuApi