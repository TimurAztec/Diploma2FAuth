import { ChangeEvent, useState } from 'react';
import { tr } from '../../../i18n';

const PermissionsList = ({permissions, permissionsData, handlePermissionChange}: any) => {
    const [showMore, setShowMore] = useState(false);
    
    const toggleShowMore = () => {
      setShowMore(!showMore);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (handlePermissionChange) {
          handlePermissionChange(event);
        }
    };
  
    return (
      <div className="flex flex-row">
        <label className="flex text-gray-700 font-bold mb-2">{tr('Permissions')}:</label>
        <details className="permissions-list ml-2">
          <summary className="cursor-pointer outline-none" onClick={toggleShowMore}>
            {showMore ? tr('Hide') : tr('Show')}
          </summary>
          <div className={`permissions-content max-h-0 overflow-hidden transition-max-height duration-300 ${showMore ? 'max-h-full' : ''}`}>
            {permissions.map((permission: string) => (
              <div key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  id={`permission-${permission}`}
                  name={`permission-${permission}`} 
                  value={permission}
                  checked={permissionsData.includes(permission)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={permission} className="text-gray-700">
                  {permission}
                </label>
              </div>
            ))}
          </div>
        </details>
      </div>
    );
  };
  
  export default PermissionsList;