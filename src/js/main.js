// 导入样式
import '../scss/main.scss';

// 导入图片
import course1Image from '../assets/images/course1.jpg';
import course2Image from '../assets/images/course2.jpg';

// 路线数据
let routes = [];

let filters = {
    wall: 'all',    // 修改默认值为'all'表示全部
    position: 'all', // 修改默认值为'all'表示全部
    color: 'all'     // 修改默认值为'all'表示全部
};

const itemsPerPage = 6;
let currentPage = 0;

// 导航栏滚动效果
const nav = document.querySelector('.main-nav');
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(74, 74, 74, 0.95)';
    } else {
        nav.style.backgroundColor = '#4a4a4a';
    }
});

// 移动端菜单
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// 课程数据
const courses = [
    {
        title: '先锋保护技术',
        image: course1Image,
        progress: 75,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/PRpxdiKhZo69LGxJJJGcYViqndg',
        description: '学习先锋攀岩的保护技术和安全要领'
    },
    {
        title: '绳结打结技巧',
        image: course2Image,
        progress: 60,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/R4vudOmO0oMHi5xZaT8cslNcnef',
        description: '掌握各种攀岩常用绳结的打法'
    },
    {
        title: '攀岩动作要领',
        image: course1Image, // 暂时复用course1.jpg
        progress: 45,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/PRpxdiKhZo69LGxJJJGcYViqndg',
        description: '学习基础攀岩动作和技巧要领'
    },
    {
        title: '攀岩安全规范',
        image: course2Image, // 暂时复用course2.jpg
        progress: 90,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/R4vudOmO0oMHi5xZaT8cslNcnef',
        description: '了解攀岩安全规范和注意事项'
    }
];

// 生成课程卡片
const courseGrid = document.querySelector('.course-grid');
courses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
        <div class="course-image" style="clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);">
            <img src="${course.image}" alt="${course.title}">
        </div>
        <h3>${course.title}</h3>
        <p class="description">${course.description}</p>
        <a href="${course.link}" target="_blank" class="learn-btn">立即学习</a>
    `;
    courseGrid.appendChild(card);
});

document.addEventListener('DOMContentLoaded', async() => {
    try {
        // 加载路线数据（如果需要）
        routes = await loadRoutes();

        // 设置初始筛选按钮状态
        const filterGroups = document.querySelectorAll('.filter-options');
        
        // 检测是否为触摸设备
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // 检测是否为微信内置浏览器
        const isWechat = /MicroMessenger/i.test(navigator.userAgent);
        
        // 为每个按钮添加点击和触摸事件监听器
        filterGroups.forEach(group => {
            const buttons = group.querySelectorAll('button');
            
            // 微信浏览器特殊处理
            if (isWechat) {
                console.log("检测到微信浏览器，使用特殊处理");
                buttons.forEach(button => {
                    // 移除所有现有事件（防止重复绑定）
                    const buttonClone = button.cloneNode(true);
                    button.parentNode.replaceChild(buttonClone, button);
                    
                    // 对克隆后的按钮添加事件
                    buttonClone.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 确保清除所有按钮的active状态
                        buttons.forEach(btn => btn.classList.remove('active'));
                        
                        // 手动添加active类
                        this.classList.add('active');
                        
                        // 更新过滤器
                        const filterType = group.getAttribute('data-filter');
                        const filterValue = this.getAttribute('data-value');
                        filters[filterType] = filterValue;
                        
                        // 立即更新路线
                        setTimeout(() => updateRoutes(), 0);
                        
                        return false;
                    });
                });
            }
            // 触摸设备通用处理
            else if (isTouchDevice) {
                buttons.forEach(button => {
                    ['touchstart', 'touchend', 'click'].forEach(eventName => {
                        button.addEventListener(eventName, function(e) {
                            if (eventName === 'touchstart') {
                                e.preventDefault();
                            }
                            
                            // 只在click或touchend事件时更改状态
                            if (eventName === 'click' || eventName === 'touchend') {
                                // 移除同组其他按钮的 active 类
                                buttons.forEach(btn => {
                                    btn.classList.remove('active');
                                });
                                
                                // 为当前点击的按钮添加 active 类
                                this.classList.add('active');
                                
                                const filterType = group.getAttribute('data-filter');
                                const filterValue = this.getAttribute('data-value');
                                // 更新筛选条件
                                filters[filterType] = filterValue;
                                
                                // 更新路线显示
                                updateRoutes();
                            }
                        }, {passive: false});
                    });
                });
            }
            // 桌面设备处理（保留原有逻辑）
            else {
                group.addEventListener('click', event => {
                    if (event.target.tagName === 'BUTTON') {
                        // 移除同组其他按钮的 active 类
                        group.querySelectorAll('button').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        // 为当前点击的按钮添加 active 类
                        event.target.classList.add('active');
                        const filterType = group.getAttribute('data-filter');
                        const filterValue = event.target.getAttribute('data-value');
                        // 更新筛选条件
                        filters[filterType] = filterValue;
                        console.log('Filters:', filters);
                        // 更新路线显示
                        updateRoutes();
                    }
                });
            }
        });

        // 初始显示所有路线
        updateRoutes();
    } catch (error) {
        console.error('初始化失败:', error);
    }
});

// 地图初始化
const map = L.map('map').setView([30.308829, 120.086003], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.marker([30.308829, 120.086003])
    .addTo(map)
    .bindPopup('浙江大学攀岩墙')
    .openPopup();

// 手风琴效果
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const title = item.querySelector('h3');
    const content = item.querySelector('.content');
    
    title.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // 关闭所有项
        accordionItems.forEach(i => {
            i.classList.remove('open');
            i.querySelector('.content').style.maxHeight = null;
        });
        
        // 如果点击的项是关闭的，则打开它
        if (!isOpen) {
            item.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// 文件上传处理
const uploadBtn = document.querySelector('.upload-btn');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'video/*';

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // 处理文件上传逻辑
        console.log('Selected file:', file.name);
    }
});
/*
// GPX文件下载
const downloadBtn = document.querySelector('.download-btn');
downloadBtn.addEventListener('click', () => {
    // 生成GPX文件内容
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
        <gpx version="1.1">
            <trk>
                <name>攀岩路线示例</name>
                <trkseg>
                    <!-- 路线坐标点 -->
                </trkseg>
            </trk>
        </gpx>`;
    
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'climbing-route.gpx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// 解析视频文件名获取路线信息
function parseVideoFilename(filename) {
    // 假设文件名格式为：wall_position_color_difficulty.mp4
    // 例如：boulder_left_red_V2.mp4
    const parts = filename.replace('.MP4', '').split('_');
    if (parts.length >= 4) {
        return {
            wall: parts[0],
            position: parts[1],
            color: parts[2],
            difficulty: parts[3]
        };
    }
    return null;
}
*/
// 更新路线数据
// 从CSV文件加载路线数据
async function loadRoutes() {
    try {
        //const response = await fetch('/src/video_list.csv');
        //const csvText = await response.text();
        //const lines = csvText.split('\n').slice(1); // 跳过标题行
        const lines = ['新型的攀石赛模式！完成线路才能晋级下一轮比拼，竞争相对激烈！,BV1vhw9euEnX,boulder;center;red'    
        ]
        return lines.map(line => {
            const [title, bv, tags] = line.split(',');
            const tagArray = tags.split(';');
            
            return {
                title: title,
                bvid: bv,
                wall: tagArray[0], // 默认值
                position: tagArray[1] || '', // 中间
                color: tagArray[2] || '', // 灰色
                difficulty: '', // 暂无难度信息
                description: `标签：${tagArray.join('、')}`
            };
        }).filter(route => route.title && route.bvid); // 过滤掉无效数据
    } catch (error) {
        console.error('加载视频数据失败:', error);
        return [];
    }
}

// 更新路线显示
function updateRoutes() {
    console.log('Updating routes with filters:', filters);
    console.log(routes);
    // 筛选路线
    const filteredRoutes = routes.filter(route => {
        const wallMatch = filters.wall === 'all' || route.wall === filters.wall;
        const positionMatch = filters.position === 'all' || route.position === filters.position;
        const colorMatch = filters.color === 'all' || route.color === filters.color;
        
        return wallMatch && positionMatch && colorMatch;
    });

    console.log('Filtered routes:', filteredRoutes);
/*
    // 计算分页
    const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageRoutes = filteredRoutes.slice(start, end);

    // 更新导航按钮状态
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage >= totalPages - 1;
*/
    // 生成视频项
    const container = document.querySelector('.video-container');
    if (filteredRoutes.length === 0) {
        container.innerHTML = '<div class="no-results">没有找到符合条件的路线</div>';
        return;
    }
    container.innerHTML = '';
    filteredRoutes.forEach(route => {
        const card = document.createElement('div');
        card.className = 'video-item';
        card.innerHTML = `
            <iframe src="https://player.bilibili.com/player.html?bvid=${route.bvid}&page=1&autoplay=0" 
                    scrolling="no" 
                    border="0" 
                    frameborder="no" 
                    framespacing="0" 
                    allowfullscreen="true">
            </iframe>
            <div class="route-info">
                <h4>${route.title}</h4>
                <p class="difficulty">难度：${route.difficulty}</p>
                <p class="color">颜色：${route.color}</p>   
                <p class="description">${route.description}</p>
            </div>
            
        `;
        container.appendChild(card);})
    /*
    container.innerHTML = pageRoutes.map(route => `
        <div class="video-item">
            <iframe src="https://player.bilibili.com/player.html?bvid=${route.bvid}&page=1" 
                    scrolling="no" 
                    border="0" 
                    frameborder="no" 
                    framespacing="0" 
                    allowfullscreen="true">
            </iframe>
            <div class="route-info">
                <h4>${route.title}</h4>
                <p class="difficulty">难度：${route.difficulty}</p>
                <p class="color">颜色：${route.color}</p>
                <p class="description">${route.description}</p>
            </div>
        </div>
    `).join('');
    */
}

/*
// 初始化筛选器和显示
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 加载路线数据
        routes = await loadRoutes();
        
        // 设置初始筛选按钮状态
        const filterGroups = document.querySelectorAll('.filter-options');
        filterGroups.forEach(group => {
            const filterType = group.dataset.filter;
            const allButton = group.querySelector('button[data-value="all"]');
            if (allButton) {
                allButton.classList.add('active');
            }
        });

        // 初始显示所有路线
        updateRoutes();
    } catch (error) {
        console.error('初始化失败:', error);
    }
});
*/
/*
// 筛选按钮点击事件处理
const filterButtons = document.querySelectorAll('.filter-options button');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterGroup = button.parentElement;
        const filterType = filterGroup.dataset.filter;
        
        // 移除同组中所有按钮的active类
        filterGroup.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 为当前点击的按钮添加active类
        button.classList.add('active');
        
        // 更新筛选条件
        filters[filterType] = button.dataset.value === 'all' ? null : button.dataset.value;
        
        // 重置页码并更新显示
        currentPage = 0;
        updateRoutes();
    });
});
*/



// 导航按钮事件处理
document.querySelector('.nav-button.prev').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateVideoDisplay();
    }
});

document.querySelector('.nav-button.next').addEventListener('click', () => {
    currentPage++;
    updateVideoDisplay();
});

// 初始化显示
updateVideoDisplay();