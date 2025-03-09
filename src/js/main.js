// 导入样式
import '../scss/main.scss';

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
        image: 'course1.jpg',
        progress: 75,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/PRpxdiKhZo69LGxJJJGcYViqndg',
        description: '学习先锋攀岩的保护技术和安全要领'
    },
    {
        title: '绳结打结技巧',
        image: 'course2.jpg',
        progress: 60,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/R4vudOmO0oMHi5xZaT8cslNcnef',
        description: '掌握各种攀岩常用绳结的打法'
    },
    {
        title: '攀岩动作要领',
        image: 'course1.jpg', // 暂时复用course1.jpg
        progress: 45,
        link: 'https://bqq5gg6kt7d.feishu.cn/docx/PRpxdiKhZo69LGxJJJGcYViqndg',
        description: '学习基础攀岩动作和技巧要领'
    },
    {
        title: '攀岩安全规范',
        image: 'course2.jpg', // 暂时复用course2.jpg
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
            <img src="/assets/images/${course.image}" alt="${course.title}">
        </div>
        <h3>${course.title}</h3>
        <p class="description">${course.description}</p>
        <div class="progress-bar">
            <div class="progress" style="width: ${course.progress}%"></div>
        </div>
        <a href="${course.link}" target="_blank" class="learn-btn">立即学习</a>
    `;
    courseGrid.appendChild(card);
});

// 视频播放器初始化
const player = videojs('route-video', {
    controls: true,
    fluid: true,
    sources: [
        {
            src: '/assets/videos/demo-480p.mp4',
            type: 'video/mp4',
            label: '480p'
        },
        {
            src: '/assets/videos/demo-720p.mp4',
            type: 'video/mp4',
            label: '720p'
        },
        {
            src: '/assets/videos/demo-1080p.mp4',
            type: 'video/mp4',
            label: '1080p'
        }
    ]
});

// 自定义播放速度控制
const speeds = [0.5, 1, 1.5, 2];
const speedButton = document.createElement('button');
speedButton.className = 'vjs-speed-button vjs-menu-button';
speedButton.innerHTML = '1x';
player.controlBar.addChild('button', {
    el: speedButton
});

let currentSpeedIndex = 1;
speedButton.onclick = () => {
    currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
    const newSpeed = speeds[currentSpeedIndex];
    player.playbackRate(newSpeed);
    speedButton.innerHTML = newSpeed + 'x';
};

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

// 紧急联系人浮窗
const emergencyBtn = document.querySelector('.emergency-btn');
const contactInfo = document.querySelector('.contact-info');

emergencyBtn.addEventListener('click', () => {
    contactInfo.classList.toggle('active');
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

// 更新路线数据
const routes = [
    {
        id: 1,
        title: '攀石基础路线',
        video: 'boulder_left_red_V2.MP4',
        thumbnail: 'course1.jpg',
        description: '适合初学者的基础路线，重点练习抓力和脚法'
    },
    {
        id: 2,
        title: '中间横向路线',
        video: 'boulder_center_blue_V3.MP4',
        thumbnail: 'course2.jpg',
        description: '横向移动训练，锻炼核心力量和平衡感'
    },
    {
        id: 3,
        title: '右侧垂直路线',
        video: 'boulder_right_yellow_V4.MP4',
        thumbnail: 'course1.jpg',
        description: '垂直上升路线，练习动态动作和手臂力量'
    },
    {
        id: 4,
        title: '综合难度路线',
        video: 'boulder_center_purple_V5.MP4',
        thumbnail: 'course2.jpg',
        description: '综合性路线，需要良好的技术和体能基础'
    },
    {
        id: 5,
        title: '粉色动力路线',
        wall: 'boulder',
        position: 'left',
        color: 'pink',
        difficulty: 'V3',
        thumbnail: 'course1.jpg',
        video: 'demo-0.MP4',
        description: '需要一定的动力动作，考验爆发力'
    },
    {
        id: 6,
        title: '棕色技术路线',
        wall: 'boulder',
        position: 'right',
        color: 'brown',
        difficulty: 'V4',
        thumbnail: 'course2.jpg',
        video: 'demo-0.MP4',
        description: '技术性路线，需要良好的重心控制'
    },
    {
        id: 7,
        title: '混合色高级路线',
        wall: 'boulder',
        position: 'center',
        color: 'mixed',
        difficulty: 'V6',
        thumbnail: 'course1.jpg',
        video: 'demo-0.MP4',
        description: '综合多个颜色的进阶路线，挑战性强'
    },
    {
        id: 8,
        title: '白色平衡路线',
        wall: 'boulder',
        position: 'left',
        color: 'white',
        difficulty: 'V3',
        thumbnail: 'course2.jpg',
        video: 'demo-0.MP4',
        description: '重点训练平衡感和精确性的路线'
    }
].map(route => {
    // 从文件名解析路线信息
    const info = parseVideoFilename(route.video);
    return {
        ...route,
        wall: info ? info.wall : 'boulder',
        position: info ? info.position : 'center',
        color: info ? info.color : 'red',
        difficulty: info ? info.difficulty : 'V2'
    };
});

// 筛选器状态
let filters = {
    wall: 'boulder',
    position: 'center',
    color: null
};

// 当前页码
let currentPage = 0;
const itemsPerPage = 4;

// 初始化筛选器
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-options button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterGroup = button.parentElement;
            const filterType = filterGroup.dataset.filter;
            const value = button.dataset.value;
            
            // 如果点击已激活的按钮，则取消选择
            if (button.classList.contains('active')) {
                button.classList.remove('active');
                filters[filterType] = null;
            } else {
                // 更新按钮状态
                filterGroup.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // 更新筛选状态
                filters[filterType] = value;
            }
            
            // 重置页码并更新显示
            currentPage = 0;
            updateRoutes();
            
            // 调试输出
            console.log('Current filters:', filters);
        });
    });

    // 设置初始状态
    document.querySelector('[data-filter="wall"] [data-value="boulder"]').classList.add('active');
    document.querySelector('[data-filter="position"] [data-value="center"]').classList.add('active');
}

// 更新路线显示
function updateRoutes() {
    console.log('Updating routes with filters:', filters);
    
    // 筛选路线
    const filteredRoutes = routes.filter(route => {
        const wallMatch = !filters.wall || route.wall === filters.wall;
        const positionMatch = !filters.position || route.position === filters.position;
        const colorMatch = !filters.color || route.color === filters.color;
        
        return wallMatch && positionMatch && colorMatch;
    });

    console.log('Filtered routes:', filteredRoutes);

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

    // 生成视频项
    const container = document.querySelector('.video-container');
    
    if (pageRoutes.length === 0) {
        container.innerHTML = '<div class="no-results">没有找到符合条件的路线</div>';
        return;
    }

    container.innerHTML = pageRoutes.map(route => `
        <div class="video-item">
            <video class="video-js vjs-default-skin" controls preload="none"
                   poster="/assets/images/${route.thumbnail}">
                <source src="/assets/videos/${route.video}" type="video/mp4">
            </video>
            <div class="route-info">
                <h4>${route.title}</h4>
                <p class="difficulty">难度：${route.difficulty}</p>
                <p class="color">颜色：${route.color}</p>
                <p class="description">${route.description}</p>
            </div>
        </div>
    `).join('');

    // 初始化视频播放器
    pageRoutes.forEach((route, index) => {
        videojs(container.children[index].querySelector('video'), {
            controls: true,
            fluid: true,
            preload: 'metadata'
        });
    });

    // 设置容器位置
    container.style.transform = `translateX(0)`;
}

// 导航按钮事件
document.querySelector('.nav-button.prev').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateRoutes();
    }
});

document.querySelector('.nav-button.next').addEventListener('click', () => {
    const filteredRoutes = routes.filter(route => {
        return (!filters.wall || route.wall === filters.wall) &&
               (!filters.position || route.position === filters.position) &&
               (!filters.color || route.color === filters.color);
    });
    const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
    
    if (currentPage < totalPages - 1) {
        currentPage++;
        updateRoutes();
    }
});

// 初始化筛选器和显示
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    updateRoutes();
}); 