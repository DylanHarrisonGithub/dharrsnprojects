import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import InfiniteContentScroller from "../../components/infinite-content-scroller/infinite-content-scroller";
import Gallery4 from "../../components/gallery/gallery4";
import ContactCard from "../../components/admin/contact/contact-card";

import { ModalContext } from "../../components/modal/modal";
import { StorageContext } from "../../components/storage/storage-context";

import HttpService from "../../services/http.service";
import { Contact } from "../../definitions/models/Contact/Contact";

const AdminContacts: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);
  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();

  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const { id } = useParams();

  React.useEffect(() => {
    if (!(storageContext.token)) {
      navigate('/login');
    }
  }, []);

  return (
    <div className="py-16 px-2 md:px-4 mx-auto diamonds">

      <div className="flex items-center justify-between">
        <h1 className="text-xl gold-text text-center inline-block ml-2 md:ml-8">
          &nbsp;&nbsp;Admin Contacts&nbsp;&nbsp;
        </h1>
        <div className="">
          <button 
            className="btn btn-circle btn-lg ml-auto border border-white mr-2 md:mr-8"
            onClick={() => navigate('/admin')}
          >
            Close
          </button>
        </div>
      </div>

      <div className='block mx-2 md:mx-8 my-4'>
        <input
          className="bg-gray-200 text-left appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
          placeholder="Search Contacts"
          value={search}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      <div className="text-center mx-2 md:mx-8 px-2 md:px-8 py-8 my-8  bg-gradient-to-br from-pink-200 via-pink-300 to-pink-200 rounded-lg">

        <InfiniteContentScroller<Contact> contentStreamingRoute={'contactstream'} content={contacts} contentSetter={setContacts} search={search} id={id} >
          <div className='text-center'>
            <Gallery4 maxColumnWidth={288} maxColumns={6}>
              {
                contacts.map((c, i) => (
                  <div 
                    key={i} 
                    className='inline-block cursor-pointer text-left'
                    onClick={() => (modalContext.modal!({prompt: `Are you sure you want to delete ${c.email}'s message?`, options: ["yes", "no"]}))!.then(res => {
                      if (res === "yes") {
                        HttpService.delete<void>('contactdelete', { id: c.id }).then(res => {
                          if (res.success) {
                            setContacts(rs => rs.filter(e => e.id !== c.id));
                            res.messages.forEach(m => modalContext.toast!('success', m));
                          } else {
                            modalContext.toast!('warning', `Unable to delete ${c.email}'s message.`);
                            res.messages.forEach(m => modalContext.toast!('warning', m));
                          }
                        });
                      }
                    }).catch(e => {})}
                  >
                    <ContactCard contact={{
                      date: (new Date(parseInt(c.timestamp.toString()))).toLocaleDateString(),
                      email: c.email,
                      subject: c.subject,
                      message: c.message
                    }}/>
                  </div>
                ))
              }
            </Gallery4>
          </div>
        </InfiniteContentScroller>

      </div>
    </div>
  )
}

export default AdminContacts;