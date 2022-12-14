import { useMutation } from '@apollo/client';
import { memo, useCallback } from 'react';
import { RemoveBookMutation, ReturnBookMutation } from '../../../../../graphql/books/mutations';
import useAppStore from '../../../../../store/appStore';
import useMainStore from '../../../../../store/mainStore';
import { IIssueRequest } from '../../../../../types/issueRequestTypes';
import { IBook } from '../../../../../types/libraryTypes';
import { UserType } from '../../../../../types/userTypes';
import { TOAST_TYPE_OPTIONS } from '../../../../../utils/constants';
import { FUNC_DATE_TO_TXT, showToast } from '../../../../../utils/functions';
import Button from '../../../../Common/Button';

// PROPS INTERFACE
interface IProps {
    creator: UserType | undefined;
    book: IBook;
    canUserEditLibrary: boolean;
    handleRequestIssue: (bookId:string) => void;
    issueRequest: IIssueRequest|null;
    handleRemoveIssueRequest: (issueRequest: IIssueRequest) => void;
    userProfile: UserType;
}

//////////////////////////////////////////
// SELECTED HOME BOOKS LIST ITEM /////////
//////////////////////////////////////////

const SelectedHomeBooksListItem: React.FC<IProps> = ({
    creator,
    book,
    canUserEditLibrary,
    handleRequestIssue,
    issueRequest,
    handleRemoveIssueRequest,
    userProfile,
}) => {
    
    const {setAppLoading} = useAppStore();
    const {removeBook, returnBookFromMainStore} = useMainStore();

    //////////////////
    // MUTATION //////
    //////////////////

    const [removeBookMutation, {}] = useMutation(
        // REMOVE BOOK MUTATION
        RemoveBookMutation,
        // OPTIONS
        {
            update(_, result) {
                // SHOW SUCCESS TOAST
                showToast(
                    // SUCCESS TYPE
                    TOAST_TYPE_OPTIONS.success,
                    "Book removed!",
                );
                
                // UPDATE MAIN STORE STATE
                removeBook(result.data.removeBook);
            },
            // ON ERROR
            onError(error) {
                console.log('Error removing book...', error);
                showToast(
                    TOAST_TYPE_OPTIONS.error,
                    "Error removing book...",
                );
            },
            variables: {
                libraryId: book.libraryId,
                bookId: book.id,
            },
        }
    );

    // RETURN BOOK MUTATION
    const [returnBookMutation, {}] = useMutation(
        // MUTATION QUERY
        ReturnBookMutation,
        // OPTIONS
        {
            update(_, result) {

                // UPDATE MAIN STORE
                returnBookFromMainStore(result.data.returnBook);

                // SHOW SUCCESS TOAST
                showToast(
                    TOAST_TYPE_OPTIONS.success,
                    "Book returned successfully!",
                )
            },
            onError(error) {
                console.log("Error returning book mutation...", error);
                showToast(
                    TOAST_TYPE_OPTIONS.error,
                    "Error returning book...",
                );
            },
            variables: {
                bookId: book.id,
            }
        }
    );
    //////////////////
    // FUNCTIONS /////
    //////////////////
    
    const handleDeleteBook = useCallback(async () => {
        try {
            // SET LOADING
            setAppLoading(true);

            // CALL REMOVE BOOK MUTATION HOOK
            await removeBookMutation();

            // SET LOADING FALSE
            setAppLoading(false);
        } catch (error) {
            console.log('Error removing book...', error);
            // SET LOADING FALSE
            setAppLoading(false);
        }
    }, [removeBookMutation, setAppLoading]);

    // HANDLE RETURN BOOK
    const handleReturnBook = useCallback(async () => {
        try {
            setAppLoading(true);

            await returnBookMutation();

            setAppLoading(false);
        } catch (error) {
            console.log('Error returning book...', error);
            setAppLoading(false);
        }
    }, [returnBookMutation, setAppLoading]);

    //////////////////
    // RENDER ////////
    //////////////////
    return (
        <div
            className='flex items-center justify-between w-full bg-gray-200 p-3 rounded-lg shadow-md'
        >
            <div className="flex flex-col items-start justify-start">
                <span className="font-bold">
                    {book.title}
                </span>
                {
                    creator &&
                    <span className="text-[12px] text-gray-400">
                        Added by:
                        <span className='font-bold ml-1'>
                            {creator.username}
                        </span>

                    </span>
                }
                <span className='text-[12px] text-gray-400'>
                    Added at: <span className='font-bold'>{FUNC_DATE_TO_TXT(new Date(book.addedAt!), '/')}</span>
                </span>
            </div>
            {/* IF LOGGED USER IS NOT STAFF AND BOOK HAS NOT BEEN ISSUED TO SOMEONE YET */}
            {
                !canUserEditLibrary && book.issuedTo === null ?

                !issueRequest ?
                <Button 
                    icon="download"
                    onClick={() => handleRequestIssue(book.id)}
                    borderRadius="10px"
                    iconCss="text-green-400"
                />
                :
                <Button 
                    txt="Remove issue request"
                    onClick={() => handleRemoveIssueRequest(issueRequest)}
                    borderRadius="10px"
                    btnCss='w-fit p-2 text-[14px] font-bold bg-red-300 text-white hover:bg-red-400 transition hover:scale-[1.1]'
                />

            :null}

            {
                book.issuedTo && book.issuedTo === userProfile.id ?
                <Button 
                    onClick={handleReturnBook}
                    txt="Return Book"
                    btnCss='w-fit p-2 rounded-lg font-bold shadow-md hover:scale-[1.1] transition bg-red-300 text-white'
                />
            :null}

            {/* IF LOGGED USER IS ADMIN/LIBRARIAN */}
            {
                canUserEditLibrary &&
                <Button
                    icon="delete"
                    onClick={handleDeleteBook}
                    borderRadius="10px"
                    iconCss="text-red-400 hover:text-red-600"
                />
            }
        </div>
    );
};

export default memo(SelectedHomeBooksListItem);