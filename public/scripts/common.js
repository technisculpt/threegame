export function check_vacancy(bounds, grid_size)
{
    let range_x = (bounds[1] - bounds[0])/grid_size - grid_size;
    let range_y = (bounds[3] - bounds[2])/grid_size - grid_size;
    
    while(1)
    {
        let rowX = Math.floor(Math.random() * range_x) + Math.floor(bounds[0]/grid_size);
        let rowY = Math.floor(Math.random() * range_y) + Math.floor(bounds[2]/grid_size);
        if (document.grid.grid[rowX][rowY])
        {
            continue;
        }
        else
        {
            return [rowX, rowY];
        } 
    }

}