import { useEffect, useState } from 'react'
import { FcSearch } from 'react-icons/fc';
// import Data from "../mock-data.json"
import DataTable from '../components/DataTable';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useQueryClient, useQuery, QueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from '../utils/axios';
import ErrMessage from '../components/ErrMessage';
import { FaPlusCircle } from 'react-icons/fa';

// For Future Use:
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function CampDashboard() {
    const [isActive, setActive] = useState(false)
    const [query, setQuery] = useState("")
    const [info, setInfo, user, setUser, campRefs, setCampRefs] = useOutletContext()
    const location = useLocation();
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    useEffect(() => {

        async function func() {
            const data = await AxFetch.get('/api/getId');
            const { id } = data.data;
            if (location.pathname == '/camp-dashboard') {
                console.log('HAHAHHAHAHAHAH ', user, id)
                if (!(user?.CampID) && id == undefined) navigate('/')
            }
        }

        func()
    }, [user])

    // useEffect(() => {
    //     fetch('http://127.0.0.1:5000/api/get/all/refugees')
    //         .then(response => response.json())
    //         .then(response => {
    //             console.log(response)
    //             setInfo(response);
    //         })
    //         .catch(error => console.log(error))

    // }, [])

    const getRefByCampId = async () => {
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data
        if (!id) setUser(null);
        console.log(data, id, "fdfdghffhdhfdhghdfg")
        const refs = await AxFetch.get(`/api/get/refugees?SearchQuery=${query}&CampID=${id}`, { validateStatus: false })
        console.log(refs)
        return refs?.data
    }

    const { status, isFetching, isLoading, error, data: campRefugees, refetch } = useQuery(
        ['camp-refugees'],
        getRefByCampId, {
        // refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false
    }
    )

    useEffect(() => {
        console.log(campRefugees)
        // if (status == "success") setCampRefs(campRefugees)
    }, [status, campRefugees?.data])


    const editEntry = (data) => {
        // fetch('http://127.0.0.1:5000/api/update/refugee')
        console.log('Editing ', data)
    }

    const deleteHelperFn = async (refId) => {
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data
        console.log(data, id, "fdfdghffhdhfdhghdfg")
        //Checking if user is authorized
        if (!id) return setUser(null);
        else return AxFetch.delete(`/api/delete/refugee/${refId}`)
    }

    const { mutate: deleteMutation } = useMutation(
        deleteHelperFn, //mutationFn
        {
            onMutate: async (id) => {
                await queryClient.cancelQueries(["camp-refugees"])
                console.log(queryClient.getQueriesData(["camp-refugees"]))
                queryClient.setQueryData(["camp-refugees"], (prevData) => prevData.filter(ele => ele.RefugeeID != id))
            },
            onSuccess: (data) => {
                console.log(data)
                setUser(prev => {
                    prev.NumberOfRefugees -= 1;
                    console.log("DELETE ENTRY : ", prev)
                    return prev
                })
            },
            onError: (error) => {
                console.log(error)
            }
        });


    const deleteEntry = async (id) => {

        // setInfo((prev) => prev.filter(ele => ele.RefugeeID != id))
        // setCampRefs((prev) => prev.filter(ele => ele.RefugeeID != id))
        const boolDelete = confirm("Do you want to delete the refugee entry");
        if (boolDelete) deleteMutation(id)

        // try {
        //     await AxFetch.delete(`/api/delete/refugee/${id}`)
        //         ((prev) => prev.filter(ele => ele.RefugeeID != id))
        // } catch (err) {
        //     console.log(err)
        // }


        // fetch(`/api/delete/refugee/${id}`, {
        //     method: "DELETE",
        //     credentials: "include"

        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         setInfo((prev) => prev.filter(ele => ele.RefugeeID != id))
        //     })
        //     .catch(error => console.log(error))
    }


    const subHandler = (e) => {
        e.preventDefault()
        refetch()
    }

    return (
        // <div className="App">
        //   {info && <p>{JSON.stringify(info)}</p>}
        // </div>
        <div className='p-10'>
            <h1 className='font-bold font-mono text-6xl p-10'>The Camp Dashboard</h1>
            <div className='text-center'>
                <form className='flex-row' onSubmit={subHandler}>
                    <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-4 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={(e) => navigate('/create-entry')}><FaPlusCircle /></button>
                    <input placeholder="Search by Name, Camp, Address, Age and Country..." onChange={event => setQuery(event.target.value)} onClick={event => setActive(prev => !prev)} className={/*isActive ? 'border-black border-2 px-7 py-3 w-[80%]' :*/ 'border-black border px-7 py-3 w-[60%] font-mono'} />
                    <button type='submit'><FcSearch className='text-center inline-block text-4xl' /></button>
                </form>
                {
                    !isLoading && !(campRefugees?.error) && campRefugees?.length > 0 && <p className='bg-yellow-200 text-black w-[50%] px-3 py-2 mx-auto rounded-lg mt-6 font-mono hover:bg-yellow-300'>Number of Refugees: {campRefugees.length}</p>
                }
                {/* {JSON.stringify(Data)} */}
                {
                    !isLoading && !(campRefugees?.error) && <DataTable data={campRefugees} col={["Name", "Gender", "CountryOfOrigin", "Age", "Message", "MessageDate"]} query={query} deleteEntry={deleteEntry == undefined ? '' : deleteEntry} editEntry={editEntry == undefined ? '' : editEntry} />
                }
                {
                    !isLoading && (campRefugees?.error || campRefugees?.length == 0) && <ErrMessage>
                        {campRefugees?.error ? campRefugees.error : "No refugees found"}
                    </ErrMessage>
                }

            </div>
        </div>
    )
}
// IoCreate IoIosCreate FaPlusSquare FaPlusCircle

export default CampDashboard
