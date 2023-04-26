import AxFetch from "./axios";

async function deleteAcc() {
    try{
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data

        if (!id) {
            setUser(null);
            return ({ undefined: true })
        }
        const response = await AxFetch.delete(
            "/api/delete/camp/"+id
          );
          localStorage.removeItem("id")
          return {data:response.data.data,  status:response.status}

    }catch({response}){
        console.log(response)
        return { error:response.data.error, status:response.status }
    }
}

export { deleteAcc }